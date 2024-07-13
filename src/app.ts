import path from "path";
import createError from "http-errors";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";

import routers from "./endpoints";
import { expressLogger } from "./utils/logger";
import { authorization } from "./middlewares/authorization";

const app = express();

app.use(cors());
app.use(expressLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// authentication middleware
app.use(authorization);
// all routes
app.use("/", routers);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // @NOTE: Global error handler
  if (err instanceof createError.HttpError) {
    return res.status(err.statusCode).send({ error: err.message });
  }

  return res.status(500).send({ error: "Internal server error" });
});

export default app;
