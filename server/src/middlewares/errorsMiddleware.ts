import { Request ,NextFunction,Response} from "express";
import { HttpException } from "../exceptions/root";

//BASE ERROR HANDLER MIDDLEWARE
export const errorMiddleware = (error:HttpException,_req:Request,res:Response,next:NextFunction)=>{
    res.status(error.statusCode || 500).json({
        success:false,
        message:error.message,
        errorCode:error.errorCode,
        errors: error.errors
    })
}