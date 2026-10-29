import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Sends the reset link. On the free plan, "from" must be onboarding@resend.dev,
// and emails only reach the address you signed up with.
export async function sendPasswordResetEmail(to, resetUrl) {
  const { error } = await resend.emails.send({
    from: "Rentify <onboarding@resend.dev>",
    to,
    subject: "Reset your Rentify password",
    html: `<p>Click the link to reset your password. It expires in 1 hour.</p>
           <p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });
  if (error) {
    throw new Error(error.message);
  }
}
