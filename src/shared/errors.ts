export type HttpError = Error & { status: number; code: string };

const withMeta = (error: Error, status: number, code: string): HttpError => {
    return Object.assign(error, { status, code });
};

export const notFound = (message: string): HttpError => withMeta(new Error(message), 404, "NOT_FOUND");

export const badRequest = (message: string): HttpError => withMeta(new Error(message), 400, "BAD_REQUEST");

export const conflict = (message: string): HttpError => withMeta(new Error(message), 409, "CONFLICT");

export const unauthorized = (message: string): HttpError => withMeta(new Error(message), 401, "UNAUTHORIZED");

export const forbidden = (message: string): HttpError => withMeta(new Error(message), 403, "FORBIDDEN");

export const unprocessableEntity = (message: string): HttpError => withMeta(new Error(message), 422, "UNPROCESSABLE_ENTITY");

export const internalServerError = (message: string): HttpError => withMeta(new Error(message), 500, "INTERNAL_SERVER_ERROR");

export const serviceUnavailable = (message: string): HttpError => withMeta(new Error(message), 503, "SERVICE_UNAVAILABLE");

export const tooManyRequests = (message: string): HttpError => withMeta(new Error(message), 429, "TOO_MANY_REQUESTS");

export const notImplemented = (message: string): HttpError => withMeta(new Error(message), 501, "NOT_IMPLEMENTED");

export const badGateway = (message: string): HttpError => withMeta(new Error(message), 502, "BAD_GATEWAY");

export const gatewayTimeout = (message: string): HttpError => withMeta(new Error(message), 504, "GATEWAY_TIMEOUT");
