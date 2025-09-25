import bcrypt from "bcryptjs";
import { signJwt } from "../../../middleware/auth";
import * as repo from "./repo";
import { randomUUID } from "node:crypto";

export async function register(input: { email: string; password: string; name?: string; role?: "ADMIN" | "USER" }) {
    // Return error if email is already in use
    const existing = await repo.findUserByEmail(input.email);
    if (existing) return { error: "EMAIL_IN_USE" };
    // Hash password
    const passwordHash = await bcrypt.hash(input.password, 10);
    const created = await repo.createUser({
        email: input.email,
        name: input.name,
        passwordHash,
        role: input.role ?? "USER",
    });
    // Sign JWT
    const token = signJwt({ sub: created.id, email: created.email, role: created.role });
    const user = { id: created.id, email: created.email, name: created.name ?? null };
    return { user, token };
}

export async function login(input: { email: string; password: string }) {
    // Return error if email is not found
    const user = await repo.findUserByEmail(input.email);
    if (!user) return { error: "INVALID_CREDENTIALS" };
    // Compare password
    const ok = await bcrypt.compare(input.password, (user as { passwordHash: string }).passwordHash);
    if (!ok) return { error: "INVALID_CREDENTIALS" };
    // Sign JWT
    const role = (user as { role: "ADMIN" | "USER" }).role;
    const token = signJwt({ sub: user.id, email: user.email, role });
    const publicUser = { id: user.id, email: user.email, name: user.name ?? null };
    return { user: publicUser, token };
}

export async function createGuestSession(input: { label?: string }) {
    // Generate random UUID
    const id = randomUUID();
    // Slice label to 128 characters
    const label = input.label?.slice(0, 128);
    // Create ghost session
    const created = await repo.createGhostSession({ id, label });
    return { guestSession: { id: created.id, label: created.label ?? null } };
}
