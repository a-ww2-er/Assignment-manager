import { Router } from "express";
import { errorHandler } from "../errorhandler";
import { getUser, login, Register } from "../controllers/authentication";
import authMiddleware from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.post("/register", errorHandler(Register));
authRouter.post("/login", errorHandler(login));
authRouter.get("/user", [authMiddleware], errorHandler(getUser));

export default authRouter;
