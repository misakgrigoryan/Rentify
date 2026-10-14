import prisma from "../lib/prisma.js";
import { hashPassword } from "../utils/password.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, language } = req.body;

    // Check the input before touching the database
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (typeof email !== "string" || !EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    // Lowercase the email so "Ann@Mail.com" and "ann@mail.com" are the same account
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const passwordHash = await hashPassword(password);

    // select picks the fields to return, so passwordHash is never sent back
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        phone: phone || null,
        language: language || "en",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        language: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};
