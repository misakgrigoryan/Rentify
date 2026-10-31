import prisma from "../lib/prisma.js";

// Public: the newest 5-star and 4-star reviews, for the Home page
export const getTestimonials = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { rating: { gte: 4 }, comment: { not: null } },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        reviewer: { select: { name: true } },
        listing: { select: { id: true, title: true } },
      },
    });
    res.json({ reviews });
  } catch (err) {
    next(err);
  }
};
