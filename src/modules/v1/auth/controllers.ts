import { Request, Response, NextFunction } from "express";
import { badRequest, conflict, unauthorized } from "../../../shared/errors";
import { login as loginSvc, register as registerSvc, createGuestSession as createGuestSessionSvc } from "./service";
import { loginSchema, registerSchema, createGuestSessionSchema } from "./validators";

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) return next(badRequest("Invalid input"));
        const result = await registerSvc(parsed.data);
        if (result.error === "EMAIL_IN_USE") return next(conflict("Email already in use"));
        return res.created(result);
    } catch (err) {
        return next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) return next(badRequest("Invalid input"));
        const result = await loginSvc(parsed.data);
        if (result.error === "INVALID_CREDENTIALS") return next(unauthorized("Invalid credentials"));
        return res.ok(result);
    } catch (err) {
        return next(err);
    }
}

export async function createGuestSession(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = createGuestSessionSchema.safeParse(req.body ?? {});
        if (!parsed.success) return res.created({ guestSession: { id: undefined } });
        const result = await createGuestSessionSvc(parsed.data);
        return res.created(result);
    } catch (err) {
        return next(err);
    }
}
