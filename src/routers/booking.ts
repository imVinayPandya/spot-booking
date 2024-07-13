import express, { Request, Response } from "express";
import { BookingController } from "../controllers/BookingController";

const router = express.Router();

const bookingController = new BookingController();

// `/bookings` endpoint
router.get("/", bookingController.onGetBooking);
router.post("/", bookingController.onCreateBooking);
router.put("/:bookingId", bookingController.onUpdateBooking);
router.delete("/:bookingId", bookingController.onDeleteBooking);

export default router;
