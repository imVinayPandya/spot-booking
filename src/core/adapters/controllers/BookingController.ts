import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import createError from "http-errors";

import { IBookingInteractor } from "../../../typings/Booking";
import { INTERFACE_TYPE } from "../../../utils/constants";
import {
  createBookingSchema,
  stringSchema,
  offsetLimitSchema,
  updateBookingSchema,
} from "../../../validations";
import logger from "../../../utils/logger";

@injectable()
export class BookingController {
  private bookingInteractor: IBookingInteractor;

  constructor(
    @inject(INTERFACE_TYPE.BookingInteractor)
    bookingInteractor: IBookingInteractor
  ) {
    this.bookingInteractor = bookingInteractor;
  }

  async onCreateBooking(req: Request, res: Response) {
    const reqBody = createBookingSchema.parse(req.body);

    if (!reqBody) {
      logger.error("Invalid request body");
      throw createError(400);
    }

    const requestingUser = req?.user;
    const { forUserId, ...booking } = req.body;

    // admin can create booking for other users
    if (requestingUser?.role === "admin" && forUserId) {
      booking.createdBy = forUserId;
    } else if (requestingUser?.role === "standard" && forUserId) {
      // standard user cannot create booking for other users
      logger.error("Standard user cannot create booking for other users");
      throw createError(403, "Unauthorized operation");
    } else {
      // admin and standard user can create booking for themselves
      booking.createdBy = requestingUser?.id;
    }

    const createdBooking = await this.bookingInteractor.createBooking(booking);

    return res.status(201).send(createdBooking);
  }

  async onGetBooking(req: Request, res: Response) {
    const requestingUser = req.user;
    const reqQuery = offsetLimitSchema.parse(req.query);
    const { offset = 0, limit = 10 } = reqQuery;

    const createdById =
      requestingUser?.role === "admin" ? undefined : requestingUser?.id;

    const booking = await this.bookingInteractor.getAllBookings(
      offset,
      limit,
      createdById
    );

    return res.status(200).send(booking);
  }

  async onUpdateBooking(req: Request, res: Response) {
    const requestingUser = req.user;
    const bookingId = stringSchema.parse(req.params.bookingId);
    const booking = updateBookingSchema.parse(req.body);

    if (!booking || !bookingId) {
      logger.error("Invalid request body or bookingId");
      throw createError(400);
    }

    let createdBy = requestingUser?.id;
    if (requestingUser?.role === "admin") {
      createdBy = undefined;
    }

    const updatedBooking = await this.bookingInteractor.updateBooking(
      bookingId,
      booking,
      createdBy
    );

    return res.status(200).send(updatedBooking);
  }

  async onDeleteBooking(req: Request, res: Response) {
    const bookingId = stringSchema.parse(req.params.bookingId);
    const requestingUser = req.user;

    if (!bookingId) {
      logger.error("bookingId not found in request params");
      throw createError(400);
    }

    const existingBooking = await this.bookingInteractor.getBooking(bookingId);
    if (!existingBooking) {
      logger.error("Booking not found");
      throw createError(404);
    }

    if (
      existingBooking.createdBy !== requestingUser?.id &&
      requestingUser?.role !== "admin"
    ) {
      logger.error("User not authorized to delete booking of other user");
      throw createError(403, "Unauthorized operation");
    }

    await this.bookingInteractor.deleteBooking(bookingId);

    return res.status(204).send();
  }
}
