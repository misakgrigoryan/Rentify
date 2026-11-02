import "dotenv/config";
import prisma from "../src/lib/prisma.js";

const email = `cascade-test-${Date.now()}@example.com`;
const user = await prisma.user.create({
  data: { email, name: "Cascade Test", passwordHash: "not-used" },
});
const listing = await prisma.listing.create({
  data: {
    title: "Cascade test item",
    description: "Temporary item for the delete test",
    price: 1,
    currency: "AMD",
    unit: "DAY",
    category: "Tools",
    location: "Yerevan",
    status: "APPROVED",
    ownerId: user.id,
  },
});
console.log("Created user", user.id, "and listing", listing.id);

await prisma.user.delete({ where: { id: user.id } });

const left = await prisma.listing.findUnique({ where: { id: listing.id } });
console.log(left ? "FAIL: listing still exists" : "PASS: listing was deleted with the user");
await prisma.$disconnect();
