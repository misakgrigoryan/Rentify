import prisma from "../lib/prisma.js";

const CURRENCIES = ["AMD", "USD", "EUR", "RUB"];
const UNITS = ["DAY", "HOUR"];
const PAGE_SIZE = 12;
const ownerSelect = { id: true, name: true };

// Checks the fields and returns clean data, or an error message.
// When partial is true (update), missing fields are skipped instead of rejected.
function parseListing(body, partial) {
  const data = {};

  for (const field of ["title", "description", "category", "location"]) {
    if (body[field] === undefined) {
      if (!partial) return { error: "Title, description, category and location are required" };
      continue;
    }
    const value = String(body[field]).trim();
    if (!value) return { error: `${field} cannot be empty` };
    data[field] = value;
  }

  if (body.price !== undefined || !partial) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price <= 0) return { error: "Price must be a positive number" };
    data.price = price;
  }
  if (body.currency !== undefined || !partial) {
    if (!CURRENCIES.includes(body.currency)) return { error: "Currency must be AMD, USD, EUR or RUB" };
    data.currency = body.currency;
  }
  if (body.unit !== undefined || !partial) {
    if (!UNITS.includes(body.unit)) return { error: "Unit must be DAY or HOUR" };
    data.unit = body.unit;
  }
  if (body.imageUrls !== undefined) {
    data.imageUrls = Array.isArray(body.imageUrls) ? body.imageUrls.map(String) : [];
  }

  return { data };
}

// Public: list approved-or-not listings with optional filters and pages
export const getListings = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || PAGE_SIZE));

    const where = {};
    if (req.query.category) where.category = String(req.query.category);
    if (req.query.location) {
      where.location = { contains: String(req.query.location), mode: "insensitive" };
    }
    if (req.query.search) {
      where.title = { contains: String(req.query.search), mode: "insensitive" };
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { owner: { select: ownerSelect } },
      }),
      prisma.listing.count({ where }),
    ]);

    res.json({ listings, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// Public: one listing by id
export const getListing = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid listing id" });
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { owner: { select: ownerSelect } },
    });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json({ listing });
  } catch (err) {
    next(err);
  }
};

// Logged-in: create a listing owned by the current user
export const createListing = async (req, res, next) => {
  try {
    const { data, error } = parseListing(req.body, false);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const listing = await prisma.listing.create({
      data: { ...data, ownerId: req.user.id },
    });

    res.status(201).json({ listing });
  } catch (err) {
    next(err);
  }
};

// Finds a listing and checks that the current user owns it.
// Returns the listing, or null after sending the error response.
async function findOwnedListing(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "Invalid listing id" });
    return null;
  }

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) {
    res.status(404).json({ message: "Listing not found" });
    return null;
  }
  if (listing.ownerId !== req.user.id) {
    res.status(403).json({ message: "You can only change your own listings" });
    return null;
  }
  return listing;
}

// Logged-in owner: update some or all fields
export const updateListing = async (req, res, next) => {
  try {
    const existing = await findOwnedListing(req, res);
    if (!existing) return;

    const { data, error } = parseListing(req.body, true);
    if (error) {
      return res.status(400).json({ message: error });
    }
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const listing = await prisma.listing.update({
      where: { id: existing.id },
      data,
    });

    res.json({ listing });
  } catch (err) {
    next(err);
  }
};

// Logged-in owner: delete a listing
export const deleteListing = async (req, res, next) => {
  try {
    const existing = await findOwnedListing(req, res);
    if (!existing) return;

    await prisma.listing.delete({ where: { id: existing.id } });

    res.json({ message: "Listing deleted" });
  } catch (err) {
    next(err);
  }
};
