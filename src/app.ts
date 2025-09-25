import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { responseEnvelope } from "./middleware/response";
import { errorHandler } from "./middleware/errorHandler";
import { prisma } from "./db/client";
import { authRouter as authRouterV1 } from "./modules/v1/auth/routes";
import { requireAuth, requireRole } from "./middleware/auth";
import { initRequestContext } from "./shared/requestContext";

export const createApp = () => {
    const app = express();
    app.use(helmet());
    app.use(cors({ origin: true, credentials: true }));
    app.use(express.json());

    // Initialize request context after pino-http
    app.use(initRequestContext);

    app.use(responseEnvelope);
    const limiter = rateLimit({ windowMs: 60_000, max: 5000 });
    app.use(limiter);

    app.get("/", (_req, res) => {
        return res.ok({ message: "asmt api" });
    });

    app.get("/health", async (_req, res) => {
        await prisma.$queryRaw`SELECT 1`;
        return res.ok({ status: "ok" });
    });

    app.use(authRouterV1());

    app.get("/me", requireAuth, (_req, res) => {
        return res.ok({ ok: true });
    });

    app.get("/admin/ping", requireAuth, requireRole("ADMIN"), (_req, res) => {
        return res.ok({ message: "admin pong" });
    });

    app.use(errorHandler);
    return app;
};
