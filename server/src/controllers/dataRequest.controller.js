import prisma from "../lib/prisma.js";
import { sendMail } from "../utils/notify.js";

const TYPES = ["ACCESS", "CORRECT", "DELETE"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Public: anyone can ask about their data, with or without an account
export const createDataRequest = async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const name = req.body.name ? String(req.body.name).trim().slice(0, 100) : null;
    const request = String(req.body.request || "");
    const message = req.body.message ? String(req.body.message).trim().slice(0, 1000) : null;

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }
    if (!TYPES.includes(request)) {
      return res.status(400).json({ message: "Choose what you want us to do" });
    }

    const saved = await prisma.dataRequest.create({
      data: { email, name, request, message },
    });

    const owner = process.env.CONTACT_EMAIL || "misak.grigoryan14@gmail.com";
    sendMail(
      owner,
      `Data request: ${request}`,
      `<p>A data request was submitted.</p>
       <p><b>Type:</b> ${request}<br><b>Email:</b> ${email}<br><b>Name:</b> ${name || "-"}</p>
       <p>${message ? message.replace(/</g, "&lt;") : ""}</p>
       <p>Request ID: ${saved.id}. Handle it within the time the privacy policy states.</p>`
    );

    res.status(201).json({ message: "Thank you. We will reply by email." });
  } catch (err) {
    next(err);
  }
};
