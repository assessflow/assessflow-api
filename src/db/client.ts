import { PrismaClient } from "@prisma/client";

// Simpler, explicit client instance. Prefer clarity over global caching.
export const prisma = new PrismaClient({
    log: ["error"],
});
