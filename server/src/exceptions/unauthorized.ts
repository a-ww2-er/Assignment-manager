import { ErrorCode, HttpException } from "./root";

// ERROR CLASS TO BUILD UNAUTHORIZED ERROR RESPONSE OBJECT
export class UnauthorizedException extends HttpException{
    constructor(message: string,errorCode:ErrorCode,error?:any) {
        super(message, errorCode, 401, error);
        this.name = "Unauthorized";
    }
}