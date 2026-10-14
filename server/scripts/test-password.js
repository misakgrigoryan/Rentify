import { hashPassword, comparePassword } from "../src/utils/password.js";

const hash = await hashPassword("secret123");
console.log("Stored hash:", hash);
console.log("Correct password matches:", await comparePassword("secret123", hash));
console.log("Wrong password matches:", await comparePassword("wrong-password", hash));
