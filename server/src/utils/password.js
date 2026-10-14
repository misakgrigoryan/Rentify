import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

// Turns a plain password into a hash to store in the database
export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

// Returns true if the plain password matches the stored hash
export async function comparePassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}
