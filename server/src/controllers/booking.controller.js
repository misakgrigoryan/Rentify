import prisma from "../lib/prisma.js";
import { sendMail, bookingRequestEmail, bookingDecisionEmail } from "../utils/notify.js";

// Bookings in these statuses block the dates
const BLOCKING = ["PENDING", "ACCEPTED", "ACTIVE"];

// Which status changes each side may make
const OWNER_NEXT = { PENDING: ["ACCEPTED", "REJECTED"], ACCEPTED: ["ACTIVE"], ACTIVE: ["COMPLETED"] };
const RENTER_NEXT = { PENDING: ["CANCELLED"], ACCEPTED: ["CANCELLED"] };

const bookingInclude = {
  listing: { select: { id: true, title: true, ownerId: true, price: true, currency: true, unit: true } },
  renter: { select: { id: true, name: true } },
};

// Renter creates a booking. The overlap check and insert run in one
// Serializable transaction, so two requests can't both book the same dates.
export const createBooking = async (req, res, next) => {
  try {
    const listingId = Number(req.body.listingId);
    const start = new Date(req.body.startDate);
    const end = new Date(req.body.endDate);

    if (!Number.isInteger(listingId)) {
      return res.status(400).json({ message: "listingId is required" });
    }
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Start and end dates are required" });
    }
    if (end <= start) {
      return res.status(400).json({ message: "End must be after start" });
    }
    if (start < new Date()) {
      return res.status(400).json({ message: "Start must be in the future" });
    }

    const result = await prisma.$transaction(
      async (tx) => {
        const listing = await tx.listing.findUnique({ where: { id: listingId } });
        if (!listing) {
          return { status: 404, body: { message: "Listing not found" } };
        }
        if (listing.ownerId === req.user.id) {
          return { status: 400, body: { message: "You cannot book your own listing" } };
        }

        // Two ranges overlap when each starts before the other ends
        const overlap = await tx.booking.findFirst({
          where: {
            listingId,
            status: { in: BLOCKING },
            startDate: { lt: end },
            endDate: { gt: start },
          },
        });
        if (overlap) {
          return { status: 409, body: { message: "This item is already booked for those dates" } };
        }

        const booking = await tx.booking.create({
          data: {
            listingId,
            renterId: req.user.id,
            startDate: start,
            endDate: end,
            message: req.body.message ? String(req.body.message) : null,
          },
          include: bookingInclude,
        });
        return { status: 201, body: { booking } };
      },
      { isolationLevel: "Serializable" }
    );

    // Email the owner after the booking is saved. A failed email never fails the request.
    if (result.status === 201) {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        include: { owner: { select: { email: true, name: true } } },
      });
      if (listing?.owner) {
        sendMail(
          listing.owner.email,
          "New booking request on Rentify",
          bookingRequestEmail(listing.owner.name, listing.title, req.user.name, start.toLocaleString(), end.toLocaleString())
        );
      }
    }

    res.status(result.status).json(result.body);
  } catch (err) {
    next(err);
  }
};

// Renter: bookings I made
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { renterId: req.user.id },
      orderBy: { startDate: "desc" },
      include: bookingInclude,
    });
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
};

// Owner: requests for my listings
export const getRequests = async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { listing: { ownerId: req.user.id } },
      orderBy: { createdAt: "desc" },
      include: bookingInclude,
    });
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
};

// Owner or renter changes status, only along the allowed steps
export const updateBookingStatus = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { listing: { select: { ownerId: true, title: true } } },
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const isOwner = booking.listing.ownerId === req.user.id;
    const isRenter = booking.renterId === req.user.id;
    if (!isOwner && !isRenter) {
      return res.status(403).json({ message: "You cannot change this booking" });
    }

    const allowed = isOwner ? OWNER_NEXT[booking.status] : RENTER_NEXT[booking.status];
    if (!allowed || !allowed.includes(status)) {
      return res.status(400).json({ message: `Cannot change status from ${booking.status} to ${status}` });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
      include: bookingInclude,
    });

    // Tell the renter when the owner accepts or rejects the request
    if (isOwner && (status === "ACCEPTED" || status === "REJECTED")) {
      const renter = await prisma.user.findUnique({
        where: { id: booking.renterId },
        select: { email: true, name: true },
      });
      if (renter) {
        sendMail(
          renter.email,
          `Your Rentify request was ${status.toLowerCase()}`,
          bookingDecisionEmail(renter.name, booking.listing.title, status)
        );
      }
    }

    res.json({ booking: updated });
  } catch (err) {
    next(err);
  }
};
