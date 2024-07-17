import "express";
import { IUser } from "./User";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}
