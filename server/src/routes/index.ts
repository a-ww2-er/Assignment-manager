import { Router } from "express";
import authRouter from "./authentication.routes";
import coursesRouter from "./courses.routes";

//ALL ROUTES ATTACHED TO BASE ROUTER
const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/courses", coursesRouter);

export default rootRouter;
