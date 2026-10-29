import prisma from "../lib/prisma.js";

const LISTING_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

// Admins (Super Admin and Moderator): all listings, optionally filtered by status
export const listAllListings = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.status) {
      if (!LISTING_STATUSES.includes(req.query.status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      where.status = req.query.status;
    }

    const listings = await prisma.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { id: true, name: true, email: true } } },
    });
    res.json({ listings });
  } catch (err) {
    next(err);
  }
};

// Admins: approve or reject a listing
export const setListingStatus = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid listing id" });
    }
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Status must be APPROVED or REJECTED" });
    }

    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const listing = await prisma.listing.update({ where: { id }, data: { status } });
    res.json({ listing });
  } catch (err) {
    next(err);
  }
};

// Super Admin: all users
export const listUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, isBanned: true, createdAt: true },
    });
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

// Super Admin: ban or unban a user
export const setBan = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { banned } = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (typeof banned !== "boolean") {
      return res.status(400).json({ message: "banned must be true or false" });
    }
    if (id === req.user.id) {
      return res.status(400).json({ message: "You cannot ban yourself" });
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isBanned: banned },
      select: { id: true, name: true, email: true, role: true, isBanned: true },
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
