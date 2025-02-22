import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { JWT_SECRET } from "../variables";
import * as jwt from "jsonwebtoken";
import { prismaClient } from "..";
import { IUserRequest } from "../types/express";

const authMiddleware = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  //EXTRACT THE TOKEN FROM HEADER
  let token = req.headers.authorization || req?.cookies?.access_token;
  if (token && token.startsWith("Bearer ")) {
    // Remove "Bearer " prefix
    token = token.slice(7);
  }
  console.log(token);
  //IF TOKEN IS NOT PRESENT , THROW UNAUTHORIZED ERROR
  if (!token) {
    next(
      new UnauthorizedException(
        "User is not authenticated",
        ErrorCode.NOT_AUTHENTICATED
      )
    );
  }

  try {
    //IF TOKEN IS PRESENT, VERIFY THE TOKEN AND EXTRACT THE PAYLOAD
    const payload: any = jwt.verify(token as any, JWT_SECRET);

    //GET THE USER FROM THE PAYLOAD
    const user = (await prismaClient.user.findFirst({
      where: { id: payload.userId },
    })) as any;
    if (!user) {
      next(
        new UnauthorizedException(
          "Unauthorized 1",
          ErrorCode.UNAUTHORIZED_ACCESS
        )
      );
    }

    //ATTACH THE USER TO THE CURRENT REQUEST OBJECT
    req.user = user;

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      next(
        new UnauthorizedException(
          "Unauthorized - Access Token Expired",
          ErrorCode.UNAUTHORIZED_ACCESS,
          error
        )
      );
    }
    next(
      new UnauthorizedException(
        "Unauthorized 2",
        ErrorCode.UNAUTHORIZED_ACCESS,
        error
      )
    );
  }
};
export default authMiddleware;
