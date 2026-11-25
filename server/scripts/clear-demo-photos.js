import "dotenv/config";
import prisma from "../src/lib/prisma.js";

// Clear only the demo listings' photos. Photos users uploaded are not touched.
const listings = await prisma.listing.findMany({ select: { id: true, imageUrls: true } });
let cleared = 0;
for (const l of listings) {
  if (l.imageUrls.some((u) => u.startsWith("/images/listings/"))) {
    await prisma.listing.update({ where: { id: l.id }, data: { imageUrls: [] } });
    cleared++;
  }
}
console.log(`Cleared demo photos from ${cleared} listing(s)`);
await prisma.$disconnect();
