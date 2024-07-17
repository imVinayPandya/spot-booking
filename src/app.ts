import path from "path";
import createError from "http-errors";
import cors from "cors";
import zod from "zod";
import express, { NextFunction, Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import routers from "./routers";
import logger, { expressLogger } from "./utils/logger";
import { authentication } from "./middlewares/authentication";

const app = express();

app.use(cors());
app.use(expressLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// health check
app.get("/", (_req: Request, res: Response) => {
  logger.info("Health check");
  return res.status(200).send({ message: "Server is running" });
});

// authentication
app.use(authentication);

// all routes
app.use("/", routers);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  logger.error("Requested Url Not found");
  next(createError(404));
});

// error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // @NOTE: Global error handler
  logger.error("", err);
  // zod error (it should in separate file or middleware)
  if (err instanceof zod.ZodError) {
    return res.status(400).send({ error: err.issues[0].message });
  }
  // http or custom error
  if (err instanceof createError.HttpError) {
    return res.status(err.statusCode).send({ error: err.message });
  }

  // prisma error (it should in separate file or middleware)
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2025")
      return res.status(404).send({ error: "Not found" });
    if (err.code === "P2003")
      return res.status(400).send({ error: "Bad request" });
  }

  return res.status(500).send({ error: "Internal server error" });
});

export default app;
