import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

import { UserRepository } from "../repositories/userRepository";
import logger from "../utils/logger";

const userRepository = new UserRepository();

export const authentication = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      logger.error("No authorization header found");
      throw createError(401, "Unauthorized");
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" && !token) {
      logger.error("Invalid authorization header");
      throw createError(401, "Unauthorized");
    }
    // find the user by the token
    const user = await userRepository.getUserByToken(token);
    // if the user is not found, throw an error
    if (!user) {
      logger.error("User not found");
      throw createError(401, "Unauthorized");
    }
    // if the user is found, attach the user to the request object
    req.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};
