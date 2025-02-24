import { HttpException } from "./root";

// ERROR CLASS TO BUILD INTERNAL ERROR , ERROR RESPONSE OBJECT

export class InternalException extends HttpException {
  constructor(message: string, error: any, errorCode: number) {
    super(message, errorCode, 500, error);
    console.log(error)
  }
}
