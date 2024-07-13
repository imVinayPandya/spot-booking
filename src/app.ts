import path from "path";
import createError from "http-errors";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";

import routers from "./endpoints";
import { expressLogger } from "./utils/logger";

const app = express();

app.use(cors());
app.use(expressLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// all routes
app.use("/", routers);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // @TODO: Global error handler
  return res.status(500).send({ error: "Internal server error" });
});

export default app;
