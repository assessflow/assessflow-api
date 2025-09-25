import { Router } from "express";
import * as controller from "./controllers";

export const authRouter = () => {
    const router = Router();
    router.post("/v1/auth/register", controller.register);
    router.post("/v1/auth/login", controller.login);
    router.post("/v1/auth/guest", controller.createGuestSession);
    return router;
};
