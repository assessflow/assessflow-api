import "express";

declare module "express-serve-static-core" {
    interface Response {
        ok<T>(data: T, options?: { meta?: Record<string, unknown>; message?: string }): this;
        created<T>(data: T, options?: { meta?: Record<string, unknown>; message?: string }): this;
        noContent(): this;
    }
    interface Request {
        user?: {
            id: string;
            email: string;
            role: "ADMIN" | "USER";
        };
    }
}
