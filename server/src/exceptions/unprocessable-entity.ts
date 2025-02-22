import { ErrorCode, HttpException } from "./root";

//ERROR CLASS TO BUILD VALIDATION ERROR RESPONSE OBJECT
export class UnprocessableEntity extends HttpException{
    constructor(message: string, errorCode: ErrorCode, errors: any) {
        super(message, errorCode, 422, errors);
        this.name = "UnprocessableEntity";
    }
}