import { User } from "@prisma/client";
import { Request } from "express";
import * as express from "express";

//ATTACH USER TYPES TO EXPRESS REQUEST INTERFACE SO WE CAN USE REQ.USER
declare module "express" {
  export interface Request {
    user?: User;
  }
}

export interface IUserRequest extends express.Request {
  user?: User;
}
