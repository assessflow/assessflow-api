import { NextFunction, Request, Response } from "express";

type SuccessOptions = {
    meta?: Record<string, unknown>;
    message?: string;
};

export function responseEnvelope(req: Request, res: Response, next: NextFunction) {
    const requestId = (req as Request & { id?: string }).id;

    res.ok = function <T>(data: T, options?: SuccessOptions) {
        const body: { success: true; data: T; meta?: Record<string, unknown>; message?: string; requestId?: string } = { success: true, data };
        if (options?.meta) body.meta = options.meta;
        if (options?.message) body.message = options.message;
        if (requestId) body.requestId = requestId;
        return res.status(200).json(body);
    };

    res.created = function <T>(data: T, options?: SuccessOptions) {
        const body: { success: true; data: T; meta?: Record<string, unknown>; message?: string; requestId?: string } = { success: true, data };
        if (options?.meta) body.meta = options.meta;
        if (options?.message) body.message = options.message;
        if (requestId) body.requestId = requestId;
        return res.status(201).json(body);
    };

    res.noContent = function () {
        return res.status(204).send();
    };

    return next();
}
