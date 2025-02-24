import { NextFunction, Request, Response } from "express";
import cloudinary from "cloudinary";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
// import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { BadRequestException } from "../exceptions/bad-request";
import {
  JWT_REFRESH_TOKEN_EXPIRE,
  JWT_REFRESH_TOKEN_SECRET,
  JWT_SECRET,
  JWT_TOKEN_EXPIRE,
} from "../variables";

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
    role,
  } = req.body;

  // Debugging: Log the received data
  // console.log("Received data:", req.body);

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
      role,
    },
  });
  console.log("User data saved", userData);

  // Respond with success
  res.status(200).json({
    message: "Registration successful",
    success: true,
    user: userData,
  });
  //   res.status(200).json({ message: "registered", success: true });
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { matricNo } = req.body;
  if (!matricNo || !req.body.password) {
    res
      .status(400)
      .json({ success: false, message: "matricNo or password is missing" });
  }
  //CHECK IF USER WITH EMAIL EXSISTS
  const user = await prismaClient.user.findFirst({
    where: { matricNo },
    include: {
      Courses: true,
      Assignment: true,
      submissions: true,
    },
  });

  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  } else {
    //CHECK CREDENTIALS
    const correctPassword = req.body.password === user.password;
    //compareSync(req.body.password, //user.password);
    if (!correctPassword) {
      throw new BadRequestException(
        "Incorrect password",
        ErrorCode.INVALID_CREDENTIALS
      );
    }
    //
    //SIGN TOKEN EXPIRES AFTER A DAY
    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "2d",
    });
    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
    const { password, ...others } = user;

    res.header("accessToken", accessToken);
    // res.header("refreshToken", refreshToken);
    console.log(others);
    res.status(200).json({
      success: true,
      message: `${user.firstName} logged in`,
      user: others,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  if (req.user) {
    const user = await prismaClient.user.findFirst({
      where: { id: req.user.id },
    });
    if (user) {
      res.status(200).json({ user, success: true });
    }
  }
};
