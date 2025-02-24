import { Router } from "express";
import { errorHandler } from "../errorhandler";
import authMiddleware from "../middlewares/authMiddleware";
import {
  createCourse,
  getAllCourses,
  registerCourse,
} from "../controllers/courses";

const coursesRouter = Router();

coursesRouter.get("/", [authMiddleware], errorHandler(getAllCourses));
coursesRouter.post("/register", [authMiddleware], errorHandler(registerCourse));
coursesRouter.post("/create", [authMiddleware], errorHandler(createCourse));
// coursesRouter.post("/login", errorHandler(login));

export default coursesRouter;
