import { prisma } from "../../../db/client";

export async function findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
}

export async function createUser(input: { email: string; name?: string; passwordHash: string; role: "ADMIN" | "USER" }) {
    return prisma.user.create({
        data: input,
        select: { id: true, email: true, name: true, role: true },
    });
}

export async function createGhostSession(input: { id: string; label?: string }) {
    return prisma.ghostSession.create({
        data: { id: input.id, label: input.label },
        select: { id: true, label: true },
    });
}

export async function getOrCreateDefaultGuestUser() {
    const email = "guest@system.local";
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { id: existing.id, email: existing.email } as const;
    const created = await prisma.user.create({ data: { email, name: "Guest", passwordHash: "!", role: "USER" } });
    return { id: created.id, email: created.email } as const;
}
