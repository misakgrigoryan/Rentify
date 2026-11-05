import prisma from "../lib/prisma.js";

const REASONS = ["SCAM", "UNSAFE", "MISLEADING", "SPAM", "OTHER"];

// Logged-in: report a listing
export const createReport = async (req, res, next) => {
  try {
    const reason = String(req.body.reason || "");
    const details = req.body.details ? String(req.body.details).trim().slice(0, 500) : null;
    const listingId = req.body.listingId ? Number(req.body.listingId) : null;

    if (!REASONS.includes(reason)) {
      return res.status(400).json({ message: "Choose a reason" });
    }
    if (!listingId) {
      return res.status(400).json({ message: "Nothing to report" });
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.ownerId === req.user.id) {
      return res.status(400).json({ message: "You cannot report your own listing" });
    }

    const report = await prisma.report.create({
      data: { reason, details, listingId, reporterId: req.user.id },
    });
    res.status(201).json({ report });
  } catch (err) {
    next(err);
  }
};

// Admins: open reports, newest first
export const listReports = async (req, res, next) => {
  try {
    const reports = await prisma.report.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      include: {
        reporter: { select: { id: true, name: true } },
        listing: { select: { id: true, title: true, status: true } },
      },
    });
    res.json({ reports });
  } catch (err) {
    next(err);
  }
};

// Admins: mark a report as resolved or dismissed
export const resolveReport = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!["RESOLVED", "DISMISSED"].includes(status)) {
      return res.status(400).json({ message: "Status must be RESOLVED or DISMISSED" });
    }
    const report = await prisma.report.update({ where: { id }, data: { status } });
    res.json({ report });
  } catch (err) {
    next(err);
  }
};
