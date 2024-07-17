import { Request, Response, NextFunction } from "express";
// import createError from "http-errors";

export const authorization = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  return next();
};
