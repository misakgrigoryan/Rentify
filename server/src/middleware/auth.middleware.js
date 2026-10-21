import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

// Blocks the request unless it has a valid token for an active user
export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Login required" });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Session expired or invalid. Please log in again" });
    }

    // Load the user again, so banned or deleted users are blocked right away
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, role: true, isBanned: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Login required" });
    }
    if (user.isBanned) {
      return res.status(403).json({ message: "This account has been banned" });
    }

    // Later controllers can read req.user
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// Allows the request only if the logged-in user has one of the given roles
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "You do not have permission" });
  }
  next();
};
