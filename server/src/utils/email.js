import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FOOTER = `<hr style="margin-top:24px;border:none;border-top:1px solid #eee">
  <p style="font-size:12px;color:#777;line-height:1.5">
    You receive this email because you asked to reset your Rentify password.
    If you did not ask, you can ignore this email. Your password stays the same.
    <a href="https://rentify-jet.vercel.app/privacy" style="color:#b04c31">Privacy policy</a>
  </p>`;

// On the free plan, "from" must be onboarding@resend.dev,
// and emails only reach the address you signed up with.
export async function sendPasswordResetEmail(to, resetUrl) {
  const { error } = await resend.emails.send({
    from: "Rentify <onboarding@resend.dev>",
    to,
    subject: "Reset your Rentify password",
    html: `<p>Click the link to reset your password. It expires in 1 hour.</p>
           <p><a href="${resetUrl}">${resetUrl}</a></p>` + FOOTER,
  });
  if (error) {
    throw new Error(error.message);
  }
}
