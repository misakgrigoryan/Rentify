import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Rentify <onboarding@resend.dev>";

// Added to every email: why it was sent, and where to read more
const FOOTER = `<hr style="margin-top:24px;border:none;border-top:1px solid #eee">
  <p style="font-size:12px;color:#777;line-height:1.5">
    You receive this email because of activity on your Rentify account (a personal project based in Armenia).
    We only send account, booking and password emails. We never send marketing.
    <a href="https://rentify-jet.vercel.app/privacy" style="color:#b04c31">Privacy policy</a>
  </p>`;

// Sends an email without ever breaking the request that triggered it
export async function sendMail(to, subject, html) {
  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html: html + FOOTER });
    if (error) console.error("Email failed:", error.message);
  } catch (err) {
    console.error("Email failed:", err.message);
  }
}

export function bookingRequestEmail(ownerName, listingTitle, renterName, start, end) {
  return `<p>Hi ${ownerName},</p>
    <p><b>${renterName}</b> asked to rent <b>${listingTitle}</b> from ${start} to ${end}.</p>
    <p>Open your Rentify dashboard to accept or reject the request.</p>`;
}

export function bookingDecisionEmail(renterName, listingTitle, status) {
  const word = status === "ACCEPTED" ? "accepted" : "rejected";
  return `<p>Hi ${renterName},</p>
    <p>Your request for <b>${listingTitle}</b> was <b>${word}</b>.</p>`;
}
