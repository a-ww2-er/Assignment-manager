import { NextFunction, Request, Response } from "express";

import { BadRequestException } from "./exceptions/bad-request";
import { InternalException } from "./exceptions/internal-exception";
import { ErrorCode, HttpException } from "./exceptions/root";

//THIS FUNCTION HELPS US TO HANDLE ERRORS OCCURED IN EVERY CONTROLLER(METHODS)
//SO WE MUST WRAP EVERY CONTROLLER WITH THE FUNCTION SO IT HANDLES THE CONTROLLER ERRORS
//ALL WE NEED TO DO IS THROW ERRORS FROM THE CONTROLLERS

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      //IF THE ERROR IS AN OBJECT OF OUR ERROR CLASS (MEANING WE HANDLED IT IN THE CONTROLLER)
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else {
        // if (error instanceof ZodError) {
        //   exception = new BadRequestException(
        //     "Unprocessable entity",
        //     ErrorCode.VALIDATION_ERROR
        //   );
        // } else {
        // ELSE THE ERROR IS FROM NODE, LIKE RUNTIME ERROR, TYPE ERRORS , UNHANDLED ERRORS
        exception = new InternalException(
          "Couldn't connect to server",
          error,
          ErrorCode.INTERNAL_EXCEPTION
        );
        // }
      }
      next(exception);
    }
  };
};
