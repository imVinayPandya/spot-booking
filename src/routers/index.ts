import express from "express";

import bookingRouter from "./booking";

const router = express.Router();

router.use("/bookings", bookingRouter);

export default router;
