import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
    // Mark Express's next() as used to keep 4-arg signature without linter noise
    void _next;

    const asRecord = (e: unknown): Record<string, unknown> | null => (e && typeof e === "object" ? (e as Record<string, unknown>) : null);

    const rec = asRecord(err);
    let status = typeof rec?.status === "number" ? rec.status : 500;
    let code = typeof rec?.code === "string" ? rec.code : "INTERNAL_ERROR";

    let message: string;
    if (err instanceof Error) {
        message = err.message;
    } else if (typeof rec?.message === "string") {
        message = rec.message;
    } else {
        message = "Unexpected error";
    }

    // Map Zod errors into structured validation payload
    let details: unknown = undefined;
    if (err instanceof ZodError) {
        status = 422;
        code = "VALIDATION_ERROR";
        details = err.issues.map((i) => ({
            path: i.path,
            code: i.code,
            message: i.message,
            // Optional fields present only on some issue kinds
            expected: "expected" in (i as object) ? (i as { expected?: unknown }).expected : undefined,
            received: "received" in (i as object) ? (i as { received?: unknown }).received : undefined,
        }));
    } else if (rec && Object.prototype.hasOwnProperty.call(rec, "details")) {
        details = (rec as { details?: unknown }).details;
    }

    const errorPayload: { code: string; message: string; details?: unknown } = {
        code,
        message,
    };
    if (details !== undefined) errorPayload.details = details;
    const body = { success: false, error: errorPayload } as const;
    res.status(status).json(body);
}
