import "dotenv/config";
import crypto from "crypto";
import prisma from "../src/lib/prisma.js";
import { hashPassword } from "../src/utils/password.js";

// Demo owner. Nobody logs in as this account, so its password is random.
const DEMO = { email: "demo@rentify.local", name: "Rentify Demo" };

const items = [
  { title: "Makita Cordless Drill", description: "18V cordless drill with battery. Good for furniture assembly and home repairs.", price: 3000, currency: "AMD", unit: "DAY", category: "Tools", location: "Yerevan", image: "/images/listings/drill.jpg" },
  { title: "High-Pressure Washer", description: "Electric pressure washer with hose and foam nozzle. Cars, patios, fences.", price: 5000, currency: "AMD", unit: "DAY", category: "Tools", location: "Gyumri", image: "/images/listings/washer.jpg" },
  { title: "FPV Racing Drone", description: "Fast 5-inch drone with camera. Includes spare propellers. Experience recommended.", price: 25, currency: "USD", unit: "DAY", category: "Drones", location: "Yerevan", image: "/images/listings/drone.jpg" },
  { title: "Portable Projector", description: "Compact home projector with built-in speaker. Good for movie nights and presentations.", price: 8000, currency: "AMD", unit: "DAY", category: "Projectors", location: "Yerevan", image: "/images/listings/projector.jpg" },
  { title: "Mountain Bike", description: "Full-suspension mountain bike, 29-inch wheels. Helmet available on request.", price: 2000, currency: "AMD", unit: "HOUR", category: "Sports", location: "Yerevan", image: "/images/listings/bike.jpg" },
  { title: "2-Person Camping Tent", description: "Lightweight dome tent with mesh door. Easy to set up, good for weekend trips.", price: 10, currency: "USD", unit: "DAY", category: "Sports", location: "Vanadzor", image: "/images/listings/tent.jpg" },
];

async function main() {
  const passwordHash = await hashPassword(crypto.randomBytes(16).toString("hex"));

  const owner = await prisma.user.upsert({
    where: { email: DEMO.email },
    update: {},
    create: { email: DEMO.email, name: DEMO.name, passwordHash, language: "hy" },
  });

  let created = 0;
  for (const item of items) {
    const exists = await prisma.listing.findFirst({
      where: { ownerId: owner.id, title: item.title },
    });
    if (exists) continue;

    await prisma.listing.create({
      data: {
        title: item.title,
        description: item.description,
        price: item.price,
        currency: item.currency,
        unit: item.unit,
        category: item.category,
        location: item.location,
        imageUrls: [item.image],
        status: "APPROVED",
        ownerId: owner.id,
      },
    });
    created++;
  }

  console.log(`Demo owner ready. New listings created: ${created}`);
}

main()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
