import { Router } from "express";
import { errorHandler } from "../errorhandler";
import authMiddleware from "../middlewares/authMiddleware";
import {
  createCourse,
  getAllCourses,
  getSingleCourse,
  registerCourse,
} from "../controllers/courses";
import adminMiddleware from "../middlewares/adminMiddleware";

const coursesRouter = Router();

coursesRouter.get("/", [authMiddleware], errorHandler(getAllCourses));
coursesRouter.post("/register", [authMiddleware], errorHandler(registerCourse));
coursesRouter.post(
  "/create",
  [authMiddleware, adminMiddleware],
  errorHandler(createCourse)
);
coursesRouter.get(
  "/:courseId",
  [authMiddleware],
  errorHandler(getSingleCourse)
);

export default coursesRouter;
