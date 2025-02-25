import { Router } from "express";
import { errorHandler } from "../errorhandler";
import { getUser, login, Register } from "../controllers/authentication";
import authMiddleware from "../middlewares/authMiddleware";
import {
  createAssignment,
  createSubmission,
  getAssignmentSubmissions,
  getLecturerSubmissions,
  getSingleAssignment,
  getSubmission,
  getSubmissionDetails,
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
  "/user/assignments",
  [authMiddleware],
  errorHandler(getUserAssignments)
);
assignmentRouter.post(
  "/create/:courseId",
  [authMiddleware, adminMiddleware],
  errorHandler(createAssignment)
);
assignmentRouter.get(
  "/submission/:assignmentId ",
  [authMiddleware],
  errorHandler(getAssignmentSubmissions)
);
assignmentRouter.get(
  "/lecturer/submissions",
  [authMiddleware, adminMiddleware],
  errorHandler(getLecturerSubmissions)
);
assignmentRouter.get(
  "/submission-for-grade/:submissionId ",
  [authMiddleware],
  errorHandler(getSubmissionDetails)
);
assignmentRouter.get(
  "/submission/:submissionId ",
  [authMiddleware],
  errorHandler(getSubmission)
);
assignmentRouter.put(
  "/submission/:submissionId/grade ",
  [authMiddleware, adminMiddleware],
  errorHandler(gradeSubmission)
);
assignmentRouter.post(
  "/:assignmentId/submissions",
  [authMiddleware, uploadFile],
  errorHandler(createSubmission)
);

export default assignmentRouter;
