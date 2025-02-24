// import { NextFunction, Request, Response } from "express";
// import { ErrorCode } from "../exceptions/root";
// import { UnauthorizedException } from "../exceptions/unauthorized";
// import { JWT_SECRET } from "../variables";
// import * as jwt from "jsonwebtoken";
// import { prismaClient } from "..";
// import { IUserRequest } from "../types/express";


// const adminMiddleware = async (
//   req: IUserRequest,
//   res: Response,
//   next: NextFunction
// ) => {

//   if (req.user) {
//     const user = req.user;
//     if (user.role == "ADMIN") {
//       next();
//     } else {
//       next(
//         new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED_ACCESS)
//       );
//     }
//   } else {
//     next(
//       new UnauthorizedException(
//         "User is not authenticated",
//         ErrorCode.NOT_AUTHENTICATED
//       )
//     );
//   }
// };

// export default adminMiddleware