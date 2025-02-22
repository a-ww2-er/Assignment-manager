import { NextFunction, Request, Response } from "express";
import cloudinary from "cloudinary";
import { prismaClient } from "..";

export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    matricNumber,
    password,
    firstName,
    lastName,
    otherNames,
    email,
    faculty,
    department,
    level,
    profileImage,
  } = req.body;

  // Debugging: Log the received data
  console.log("Received data:", req.body);

  // Upload image to Cloudinary if it exists
  let imageUrl = "";
  if (profileImage) {
    const result = await cloudinary.v2.uploader.upload(profileImage, {
      folder: "assignment-manager/profile-photos",
    });
    imageUrl = result.secure_url;
  }

  // Save user data to the database (replace this with your database logic)
  const userData = await prismaClient.user.create({
    data: {
      matricNo: matricNumber,
      password,
      firstName,
      lastName,
      otherNames,
      email,
      faculty,
      department,
      level,
      profileImage: imageUrl,
    },
  });
  console.log("User data to save:", userData);

  // Respond with success
  res.status(200).json({
    message: "Registration successful",
    success: true,
    user: userData,
  });
  //   res.status(200).json({ message: "registered", success: true });
};
