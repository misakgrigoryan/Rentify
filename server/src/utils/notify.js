import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Rentify <onboarding@resend.dev>";

// Sends an email without ever breaking the request that triggered it
export async function sendMail(to, subject, html) {
  try {
    const { error } = await resend.emails.send({ from: FROM, to, subject, html });
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
