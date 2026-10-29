import prisma from "../lib/prisma.js";

const CURRENCIES = ["AMD", "USD", "EUR", "RUB"];
const UNITS = ["DAY", "HOUR"];

// Public: list all listings, newest first
export const getListings = async (req, res, next) => {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { id: true, name: true } } },
    });
    res.json({ listings });
  } catch (err) {
    next(err);
  }
};

// Logged-in users only: create a listing owned by the current user
export const createListing = async (req, res, next) => {
  try {
    const { title, description, price, currency, unit, category, location, imageUrls } = req.body;

    if (!title || !description || !price || !currency || !unit || !category || !location) {
      return res.status(400).json({ message: "All listing fields are required" });
    }
    if (!CURRENCIES.includes(currency)) {
      return res.status(400).json({ message: "Currency must be AMD, USD, EUR or RUB" });
    }
    if (!UNITS.includes(unit)) {
      return res.status(400).json({ message: "Unit must be DAY or HOUR" });
    }
    const priceNumber = Number(price);
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    const listing = await prisma.listing.create({
      data: {
        title: String(title).trim(),
        description: String(description),
        price: priceNumber,
        currency,
        unit,
        category: String(category),
        location: String(location),
        imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
        ownerId: req.user.id,
      },
    });

    res.status(201).json({ listing });
  } catch (err) {
    next(err);
  }
};
