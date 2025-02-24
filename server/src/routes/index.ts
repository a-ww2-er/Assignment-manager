import { Router } from "express";
import authRouter from "./authentication.routes";
import coursesRouter from "./courses.routes";
import assignmentsRouter from "./assignment.routes";

//ALL ROUTES ATTACHED TO BASE ROUTER
const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/courses", coursesRouter);
rootRouter.use("/assignments", assignmentsRouter);

export default rootRouter;
