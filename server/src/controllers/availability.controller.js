import prisma from "../lib/prisma.js";

// Bookings in these statuses block the dates
const BLOCKING = ["PENDING", "ACCEPTED", "ACTIVE"];

// Public: approved listings that have no overlapping booking for the dates
export const getAvailableListings = async (req, res, next) => {
  try {
    const start = new Date(req.query.startDate);
    const end = new Date(req.query.endDate);

    if (isNaN(start) || isNaN(end) || end <= start) {
      return res.status(400).json({ message: "Enter a valid start and end date" });
    }

    const listings = await prisma.listing.findMany({
      where: {
        status: "APPROVED",
        bookings: {
          none: {
            status: { in: BLOCKING },
            startDate: { lt: end },
            endDate: { gt: start },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { id: true, name: true } } },
    });

    res.json({ listings, total: listings.length });
  } catch (err) {
    next(err);
  }
};
