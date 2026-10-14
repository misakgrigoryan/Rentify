import { PrismaClient } from "@prisma/client";

// One shared database connection for the whole app
const prisma = new PrismaClient();

export default prisma;
