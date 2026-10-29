import crypto from "crypto";
import prisma from "../lib/prisma.js";
import { hashPassword } from "../utils/password.js";
import { sendPasswordResetEmail } from "../utils/email.js";

const ONE_HOUR = 60 * 60 * 1000;

// We store only the hash of the token, never the token itself
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

export const forgotPassword = async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Same reply whether or not the account exists
    const genericReply = {
      message: "If an account exists for that email, a reset link has been sent",
    };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json(genericReply);
    }

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: hashToken(token),
        passwordResetExpires: new Date(Date.now() + ONE_HOUR),
      },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    res.json(genericReply);
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: "Token and new password are required" });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const user = await prisma.user.findFirst({
      where: {
        passwordResetTokenHash: hashToken(String(token)),
        passwordResetExpires: { gt: new Date() },
      },
    });
    if (!user) {
      return res.status(400).json({ message: "This reset link is invalid or has expired" });
    }

    // Save the new password and clear the token so it can't be used twice
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(password),
        passwordResetTokenHash: null,
        passwordResetExpires: null,
      },
    });

    res.json({ message: "Password updated. You can now log in" });
  } catch (err) {
    next(err);
  }
};
