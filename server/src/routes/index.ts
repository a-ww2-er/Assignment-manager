import { Router } from "express";
import authRouter from "./authentication.routes";

//ALL ROUTES ATTACHED TO BASE ROUTER
const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);

export default rootRouter;
