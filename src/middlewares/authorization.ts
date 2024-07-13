import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

export const authorization = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  // @TODO: Implement your own authorization logic here
  return next();
};
