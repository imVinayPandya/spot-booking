import express from "express";

import { BookingController } from "../controllers/BookingController";
import { BookingInteractor } from "../interactors/bookingInteractor";
import { BookingRepository } from "../repositories/bookingRepositories";

const router = express.Router();

const bookingRepository = new BookingRepository();
const bookingInteractor = new BookingInteractor(bookingRepository);
const bookingController = new BookingController(bookingInteractor);

// `/bookings` endpoint
router.get("/", bookingController.onGetBooking.bind(bookingController));
router.post("/", bookingController.onCreateBooking.bind(bookingController));
router.put(
  "/:bookingId",
  bookingController.onUpdateBooking.bind(bookingController)
);
router.delete(
  "/:bookingId",
  bookingController.onDeleteBooking.bind(bookingController)
);

export default router;
