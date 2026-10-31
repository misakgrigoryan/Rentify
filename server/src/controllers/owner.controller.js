import prisma from "../lib/prisma.js";

// Public: an owner's name, their approved listings, and their average rating
export const getOwnerProfile = async (req, res, next) => {
  try {
    const ownerId = Number(req.params.id);
    if (!Number.isInteger(ownerId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { id: true, name: true, createdAt: true },
    });
    if (!owner) {
      return res.status(404).json({ message: "User not found" });
    }

    const listings = await prisma.listing.findMany({
      where: { ownerId, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { id: true, name: true } } },
    });

    const reviews = await prisma.review.findMany({
      where: { reviewedId: ownerId },
      select: { rating: true },
    });
    const average = reviews.length
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : null;

    res.json({ owner, listings, average, reviewCount: reviews.length });
  } catch (err) {
    next(err);
  }
};
