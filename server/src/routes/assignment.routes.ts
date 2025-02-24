import { Router } from "express";
import { errorHandler } from "../errorhandler";
import { getUser, login, Register } from "../controllers/authentication";
import authMiddleware from "../middlewares/authMiddleware";
import {
  createAssignment,
  createSubmission,
  getAssignmentSubmissions,
  getSingleAssignment,
  getSubmission,
  getUserAssignments,
  gradeSubmission,
} from "../controllers/assignment";
import adminMiddleware from "../middlewares/adminMiddleware";
import { uploadFile } from "../middlewares/fileUpload";

const assignmentRouter = Router();

assignmentRouter.get(
  "/:assignmentId",
  [authMiddleware],
  errorHandler(getSingleAssignment)
);
assignmentRouter.get(
  "/user",
  [authMiddleware],
  errorHandler(getUserAssignments)
);
assignmentRouter.post(
  "/create",
  [authMiddleware, adminMiddleware],
  errorHandler(createAssignment)
);
assignmentRouter.get(
  "/submission/:assignmentId ",
  [authMiddleware],
  errorHandler(getAssignmentSubmissions)
);
assignmentRouter.get(
  "/submission/:submissionId ",
  [authMiddleware],
  errorHandler(getSubmission)
);
assignmentRouter.post(
  "/submission/grade/:submissionId ",
  [authMiddleware, adminMiddleware],
  errorHandler(gradeSubmission)
);
assignmentRouter.post(
  "/:assignmentId/submissions",
  [authMiddleware, uploadFile],
  errorHandler(createSubmission)
);

export default assignmentRouter;
