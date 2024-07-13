import Router from "express-promise-router";

import bookingContainer from "../containers/bookingContainer";

const router = Router();

// `/bookings` endpoints
router.get("/", bookingContainer.onGetBooking.bind(bookingContainer));
router.post("/", bookingContainer.onCreateBooking.bind(bookingContainer));
router.put(
  "/:bookingId",
  bookingContainer.onUpdateBooking.bind(bookingContainer)
);
router.delete(
  "/:bookingId",
  bookingContainer.onDeleteBooking.bind(bookingContainer)
);

export default router;
