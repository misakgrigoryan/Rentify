import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../utils/password.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Only these fields are ever sent back to the frontend
const publicUserFields = {
  id: true,
  name: true,
  email: true,
  phone: true,
  language: true,
  role: true,
  createdAt: true,
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, language } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (typeof email !== "string" || !EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        phone: phone || null,
        language: language || "en",
      },
      select: publicUserFields,
    });

    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Same message for "no such account" and "wrong password"
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordOk = await comparePassword(password, user.passwordHash);
    if (!passwordOk) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "This account has been banned" });
    }

    // The token holds only the user id and role, never the password
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        language: user.language,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Returns the user that requireAuth loaded from the token
export const getMe = (req, res) => {
  res.json({ user: req.user });
};
