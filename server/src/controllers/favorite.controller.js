import prisma from "../lib/prisma.js";

// Logged-in: list my saved listings
export const getFavorites = async (req, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { listing: { include: { owner: { select: { id: true, name: true } } } } },
    });
    res.json({ listings: favorites.map((f) => f.listing) });
  } catch (err) {
    next(err);
  }
};

// Logged-in: list the ids I have saved (used to fill the hearts)
export const getFavoriteIds = async (req, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      select: { listingId: true },
    });
    res.json({ ids: favorites.map((f) => f.listingId) });
  } catch (err) {
    next(err);
  }
};

// Logged-in: save a listing
export const addFavorite = async (req, res, next) => {
  try {
    const listingId = Number(req.params.listingId);
    if (!Number.isInteger(listingId)) {
      return res.status(400).json({ message: "Invalid listing id" });
    }
    await prisma.favorite.upsert({
      where: { userId_listingId: { userId: req.user.id, listingId } },
      update: {},
      create: { userId: req.user.id, listingId },
    });
    res.status(201).json({ message: "Saved" });
  } catch (err) {
    next(err);
  }
};

// Logged-in: remove a saved listing
export const removeFavorite = async (req, res, next) => {
  try {
    const listingId = Number(req.params.listingId);
    await prisma.favorite.deleteMany({ where: { userId: req.user.id, listingId } });
    res.json({ message: "Removed" });
  } catch (err) {
    next(err);
  }
};
