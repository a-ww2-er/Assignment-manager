import { ErrorCode, HttpException } from "./root";

// ERROR CLASS TO BUILD NOT FOUND ERROR RESPONSE OBJECT
export class NotFoundException extends HttpException{
    constructor(message: string,errorCode:ErrorCode) {
        super(message, errorCode, 404, null);
        this.name = "NotFound";
    }
}