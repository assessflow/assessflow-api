import { AsyncLocalStorage } from "node:async_hooks";
import type { NextFunction, Request, Response } from "express";

type RequestContext = {
    requestId: string;
    method?: string;
    path?: string;
    ip?: string;
    userAgent?: string;
    userId?: string;
    clientId?: string;
};

const storage = new AsyncLocalStorage<RequestContext>();

type RequestWithId = Request & { id?: string };

export function initRequestContext(req: Request, _res: Response, next: NextFunction) {
    const requestId = (req as RequestWithId).id || globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    const ctx: RequestContext = {
        requestId,
        method: req.method,
        path: req.originalUrl || req.url,
        ip: req.ip,
        userAgent: req.get("user-agent") || undefined,
    };
    storage.run(ctx, () => next());
}

export function setRequestUser(userId: string | undefined) {
    const ctx = storage.getStore();
    if (ctx) ctx.userId = userId;
}

export function getRequestContext(): RequestContext | undefined {
    return storage.getStore();
}
