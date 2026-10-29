import prisma from "../lib/prisma.js";

// Renter leaves a review for a completed booking. One review per booking.
export const createReview = async (req, res, next) => {
  try {
    const bookingId = Number(req.body.bookingId);
    const rating = Number(req.body.rating);

    if (!Number.isInteger(bookingId)) {
      return res.status(400).json({ message: "bookingId is required" });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be a whole number from 1 to 5" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { listing: { select: { id: true, ownerId: true } } },
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.renterId !== req.user.id) {
      return res.status(403).json({ message: "Only the renter can review this booking" });
    }
    if (booking.status !== "COMPLETED") {
      return res.status(400).json({ message: "You can review a booking only after it is completed" });
    }

    const existing = await prisma.review.findUnique({ where: { bookingId } });
    if (existing) {
      return res.status(409).json({ message: "You already reviewed this booking" });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment: req.body.comment ? String(req.body.comment).trim() : null,
        bookingId,
        listingId: booking.listing.id,
        reviewerId: req.user.id,
        reviewedId: booking.listing.ownerId,
      },
    });

    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
};

// Public: all reviews for one listing, plus the average rating
export const getListingReviews = async (req, res, next) => {
  try {
    const listingId = Number(req.params.listingId);
    if (!Number.isInteger(listingId)) {
      return res.status(400).json({ message: "Invalid listing id" });
    }

    const reviews = await prisma.review.findMany({
      where: { listingId },
      orderBy: { createdAt: "desc" },
      include: { reviewer: { select: { id: true, name: true } } },
    });

    const average = reviews.length
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : null;

    res.json({ reviews, average, count: reviews.length });
  } catch (err) {
    next(err);
  }
};
