import Router from "express-promise-router";

import bookingRouter from "./booking";

const router = Router();

router.use("/bookings", bookingRouter);

export default router;
