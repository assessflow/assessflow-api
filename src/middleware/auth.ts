import { NextFunction, Request, Response } from "express";
import jwt, { type SignOptions, type JwtPayload as JwtLibPayload } from "jsonwebtoken";
import { forbidden, unauthorized } from "../shared/errors";
import { setRequestUser } from "../shared/requestContext";

type TokenClaims = {
    sub: string;
    email: string;
    role: "ADMIN" | "USER";
};

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not set");
    return secret;
};

export const signJwt = (payload: TokenClaims, opts?: SignOptions) => {
    const options: SignOptions = { ...(opts ?? {}), expiresIn: opts?.expiresIn ?? "7d" };
    return jwt.sign(payload, getJwtSecret(), options);
};

export const verifyJwt = (token: string): JwtLibPayload & TokenClaims => {
    const decoded = jwt.verify(token, getJwtSecret());
    if (typeof decoded === "string") throw new Error("Invalid token payload");
    return decoded as JwtLibPayload & TokenClaims;
};

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.header("authorization") ?? req.header("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;
    if (!token) return next(unauthorized("Missing bearer token"));
    try {
        const payload = verifyJwt(token);
        req.user = { id: payload.sub, email: payload.email, role: payload.role };
        setRequestUser(payload.sub);
        return next();
    } catch {
        return next(unauthorized("Invalid or expired token"));
    }
}

export function requireRole(...roles: Array<"ADMIN" | "USER">) {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) return next(unauthorized("Not authenticated"));
        if (!roles.includes(req.user.role)) return next(forbidden("Insufficient role"));
        return next();
    };
}
