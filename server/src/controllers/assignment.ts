import { Request, Response } from "express";
import { prismaClient } from "..";
import { uploadStream } from "../middlewares/fileUpload";
import multer from "multer";
// controllers/getLecturerSubmissions.ts
export const getLecturerSubmissions = async (req: Request, res: Response) => {
  try {
    // Verify user is lecturer
    if (req.user?.role !== "LECTURER") {
      return res
        .status(403)
        .json({ error: "Only lecturers can view submissions" });
    }

    const courses = await prismaClient.course.findMany({
      where: { lecturerId: req.user.id },
      include: {
        assignments: {
          include: {
            submissions: {
              include: {
                student: {
                  select: {
                    firstName: true,
                    lastName: true,
                    matricNo: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Flatten the nested structure
    const submissions = courses.flatMap((course) =>
      course.assignments.flatMap((assignment) =>
        assignment.submissions.map((sub) => ({
          id: sub.id,
          studentName: `${sub.student.firstName} ${sub.student.lastName}`,
          matricNo: sub.student.matricNo,
          assignmentTitle: assignment.title,
          courseCode: course.courseCode,
          submittedAt: sub.submittedAt,
          grade: sub.grade,
        }))
      )
    );

    res.status(200).json(submissions);
  } catch (error) {
    console.log("lecturere submission error", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};

// Create Assignment
export const createAssignment = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { title, description, dueDate, category, type, questions } = req.body;
  //   if (type == "QUIZ" && req.body.questions) {
  //     console.log("added questions");
  //     req.body.questions = req.body.questions.map((question: any) => {
  //       question.options.join(",");
  //       return question;
  //     });
  //   }
  try {
    // Verify user is lecturer
    if (req.user?.role !== "LECTURER") {
      return res
        .status(403)
        .json({ error: "Only lecturers can create assignments" });
    }

    const assignment = await prismaClient.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        category,
        type,
        questions: {
          create:
            type === "QUIZ"
              ? questions.map((q: any) => ({
                  question: q.question,
                  answer: q.answer,
                  options: Array.isArray(q.options)
                    ? q.options.join(",")
                    : q.options,
                }))
              : [],
        },
        course: { connect: { id: courseId } },
        lecturer: { connect: { id: req.user.id } },
      },
      include: {
        questions: true,
      },
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create assignment" });
  }
};

// Get Single Assignment with User Submission
export const getSingleAssignment = async (req: Request, res: Response) => {
  const { assignmentId } = req.params;

  try {
    const assignment = await prismaClient.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        submissions: {
          where: { studentId: req.user?.id },
        },
        files: true,
        questions: true,
        course: true,
      },
    });

    if (!assignment)
      return res.status(404).json({ error: "Assignment not found" });

    res.status(200).json({
      ...assignment,
      userSubmission: assignment.submissions[0] || null,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assignment" });
  }
};

// Create Submission
export const createSubmission = async (req: Request, res: Response) => {
  const { assignmentId } = req.params;

  try {
    // Get assignment details
    const assignment = await prismaClient.assignment.findUnique({
      where: { id: assignmentId },
      include: { questions: true },
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    let submissionData: any = {
      student: { connect: { id: req?.user?.id } },
      assignment: { connect: { id: assignmentId } },
    };

    // Handle different assignment types
    if (assignment.type === "DOCUMENT_UPLOAD") {
      if (!req?.file) {
        return res
          .status(400)
          .json({ message: "File is required for this assignment" });
      }

      const fileUrl = await uploadStream(req?.file.buffer);
      submissionData.fileUrl = fileUrl;
    } else if (assignment.type === "QUIZ") {
      const { quizAnswers } = req.body;

      if (!quizAnswers) {
        return res.status(400).json({ message: "Quiz answers are required" });
      }

      // Validate quiz answers structure
      //   const isValid = assignment.questions.every((question) =>
      //     quizAnswers.hasOwnProperty(question.id)
      //   );

      //   if (!isValid) {
      //     return res.status(400).json({ message: "Invalid quiz answers format" });
      //   }

      submissionData.quizAnswers = quizAnswers;
    }

    // Create submission
    const submission = await prismaClient.submission.create({
      data: submissionData,
      include: {
        assignment: true,
        student: true,
      },
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error("Submission error:", error);

    let errorMessage = "Failed to create submission";
    if (error instanceof multer.MulterError) {
      errorMessage =
        error?.code === "LIMIT_FILE_SIZE"
          ? "File size too large (max 10MB)"
          : "File upload error";
    }

    res.status(500).json({ error: errorMessage });
  }
};

// Get Assignment Submissions (Lecturer View)
// Get all submissions for an assignment
export const getAssignmentSubmissions = async (req: Request, res: Response) => {
  const { assignmentId } = req.params;

  try {
    const submissions = await prismaClient.submission.findMany({
      where: { assignmentId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            matricNo: true,
            email: true,
          },
        },
        assignment: {
          select: {
            title: true,
            course: {
              select: {
                courseCode: true,
              },
            },
          },
        },
      },
    });

    const formattedSubmissions = submissions.map((sub) => ({
      id: sub.id,
      studentName: `${sub.student.firstName} ${sub.student.lastName}`,
      matricNo: sub.student.matricNo,
      assignmentTitle: sub.assignment.title,
      courseCode: sub.assignment.course.courseCode,
      submittedAt: sub.submittedAt,
      grade: sub.grade,
      fileUrl: sub.fileUrl,
      quizAnswers: sub.quizAnswers,
    }));

    res.status(200).json(formattedSubmissions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};
// Get submission details with student history
export const getSubmissionDetails = async (req: Request, res: Response) => {
  const { submissionId } = req.params;

  try {
    // Verify user is lecturer
    if (req.user?.role !== "LECTURER") {
      return res
        .status(403)
        .json({ error: "Only lecturers can view submissions" });
    }

    const submission = await prismaClient.submission.findUnique({
      where: { id: submissionId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            matricNo: true,
          },
        },
        assignment: {
          include: {
            course: true,
            submissions: {
              where: {
                student: {
                  id: (
                    await prismaClient.submission.findUnique({
                      where: { id: submissionId },
                      select: { studentId: true },
                    })
                  )?.studentId,
                },
              },
              select: {
                id: true,
                submittedAt: true,
                grade: true,
                assignment: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    const formattedData = {
      id: submission.id,
      studentName: `${submission.student.firstName} ${submission.student.lastName}`,
      matricNo: submission.student.matricNo,
      assignmentTitle: submission.assignment.title,
      submissionDate: submission.submittedAt,
      grade: submission.grade,
      fileUrl: submission.fileUrl,
      fileType: submission.fileUrl?.split(".").pop() || null,
      studentHistory: submission.assignment.submissions
        .filter((s) => s.id !== submissionId)
        .map((s) => ({
          assignmentTitle: s.assignment.title,
          submissionDate: s.submittedAt,
          grade: s.grade,
        })),
    };

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch submission details" });
  }
};

// Grade Submission
export const gradeSubmission = async (req: Request, res: Response) => {
  const { submissionId } = req.params;
  const { grade } = req.body;

  if (grade < 0 || grade > 15) {
    return res.status(400).json({ error: "Grade must be between 0-15" });
  }

  try {
    // Verify user is lecturer
    if (req.user?.role !== "LECTURER") {
      return res
        .status(403)
        .json({ error: "Only lecturers can grade submissions" });
    }

    const gradedSubmission = await prismaClient.submission.update({
      where: { id: submissionId },
      data: {
        grade,
        gradedAt: new Date(),
        gradedBy: { connect: { id: req.user.id } },
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(200).json(gradedSubmission);
  } catch (error) {
    res.status(500).json({ error: "Failed to grade submission" });
  }
};

// Get all user assignments
export const getUserAssignments = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      include: {
        enrolledCourses: {
          include: {
            assignments: {
              include: {
                submissions: {
                  where: { studentId: userId },
                },
              },
            },
          },
        },
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const assignments = user.enrolledCourses.flatMap((course) =>
      course.assignments.map((assignment) => ({
        ...assignment,
        courseCode: course.courseCode,
        status: getAssignmentStatus(assignment),
        grade: assignment.submissions[0]?.grade || null,
      }))
    );
    console.log("user assignments", assignments);
    res.status(200).json(assignments);
  } catch (error) {
    console.log("failed to get user assignmers", error);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
};

// Get single submission
export const getSubmission = async (req: Request, res: Response) => {
  const { submissionId } = req.params;

  try {
    const submission = await prismaClient.submission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!submission)
      return res.status(404).json({ error: "Submission not found" });

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch submission" });
  }
};

// Helper function
const getAssignmentStatus = (assignment: any) => {
  const now = new Date();
  const dueDate = new Date(assignment.dueDate);

  if (assignment.submissions.length > 0) return "completed";
  if (dueDate < now) return "missed";
  return "upcoming";
};
