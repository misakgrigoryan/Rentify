// Accepts +374 followed by 8 digits, or 0 followed by 8 digits.
// Spaces, dashes and brackets are removed first. Returns the clean number, or null.
export function normalizePhone(raw) {
  const cleaned = String(raw).replace(/[\s\-()]/g, "");
  return /^(\+374\d{8}|0\d{8})$/.test(cleaned) ? cleaned : null;
}
