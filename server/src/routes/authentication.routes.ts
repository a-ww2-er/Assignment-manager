import { Router } from "express";
import { errorHandler } from "../errorhandler";
import { Register } from "../controllers/authentication";

const authRouter = Router();

authRouter.post("/register", errorHandler(Register));

export default authRouter;
