import { Request, Response } from "express";
import { prismaClient } from "..";
import { User } from "@prisma/client";

export const registerCourse = async (req: Request, res: Response) => {
  const { courseId } = req.body;
  const userId = req.user?.id;

  try {
    // Verify user is student
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { role: true, enrolledCourses: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.role !== "STUDENT") {
      return res
        .status(403)
        .json({ error: "Only students can register for courses" });
    }

    // Check if already enrolled
    const isEnrolled = user.enrolledCourses.some(
      (course) => course.id === courseId
    );
    if (isEnrolled) {
      return res.status(400).json({ error: "Already enrolled in this course" });
    }

    // Register student for course
    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: {
        enrolledCourses: {
          connect: { id: courseId },
        },
      },
      include: {
        enrolledCourses: true,
      },
    });

    res.status(200).json({
      message: "Course registration successful",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error registering course:", error);
    res.status(500).json({ error: "Failed to register course" });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  const { title, courseCode } = req.body;

  try {
    // Verify user is lecturer
    if (req.user?.role !== "LECTURER") {
      return res
        .status(403)
        .json({ error: "Only lecturers can create courses" });
    }

    const newCourse = await prismaClient.course.create({
      data: {
        title,
        courseCode,
        lecturer: {
          connect: { id: req.user.id },
        },
      },
      include: {
        lecturer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
};

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prismaClient.course.findMany({
      include: {
        lecturer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        students: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        assignments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    res.status(200).json({
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// Get Single Course with Assignments
export const getSingleCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  try {
    const course = await prismaClient.course.findUnique({
      where: { id: courseId },
      include: {
        assignments: {
          include: {
            files: true,
            questions: true,
          },
        },
        lecturer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!course) return res.status(404).json({ error: "Course not found" });

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch course" });
  }
};
