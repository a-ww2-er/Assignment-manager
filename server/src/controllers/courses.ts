import { Request, Response } from "express";
import { prismaClient } from "..";
import { User } from "@prisma/client";
export const registerCourse = async (req: Request, res: Response) => {
  const { courseId } = req.body;
  const userId = req.user?.id; // Assuming you have user authentication middleware

  try {
    // Fetch the user and course
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      include: { course: true, Courses: true },
    });

    const course = await prismaClient.course.findUnique({
      where: { id: courseId },
    });

    if (!user || !course) {
      return res.status(404).json({ error: "User or course not found" });
    }

    let updatedUser: User;

    if (user.role === "LECTURER") {
      // If lecturer, connect them as the course lecturer
      updatedUser = await prismaClient.user.update({
        where: { id: userId },
        data: {
          course: {
            connect: { id: courseId },
          },
        },
        include: {
          course: true,
          Assignment: true,
          Courses: true,
          submissions: true,
        },
      });
    } else if (user.role === "STUDENT") {
      // If student, add the course to their enrolled courses
      updatedUser = await prismaClient.user.update({
        where: { id: userId },
        data: {
          Courses: {
            connect: { id: courseId },
          },
        },
        include: { Courses: true, Assignment: true, submissions: true },
      });
    } else {
      return res.status(400).json({ error: "Invalid user role" });
    }

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
    // Create the course
    const newCourse = await prismaClient.course.create({
      data: {
        title,
        courseCode,
        lecturer: {
          connect: {
            id: req.user?.id,
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
        lecturer: true, // Include the lecturer details
        User: true, // Include enrolled students
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
