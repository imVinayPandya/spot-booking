import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import createError from "http-errors";

import { IBookingInteractor } from "../typings/Booking";
import { INTERFACE_TYPE } from "../utils/constants";

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
    const requestingUser = req?.user;
    // @TODO: add zod validation
    const { forUserId, ...booking } = req.body;

    // admin can create booking for other users
    if (requestingUser?.role === "admin" && forUserId) {
      booking.createdBy = forUserId;
    } else if (requestingUser?.role === "standard" && forUserId) {
      // standard user cannot create booking for other users
      throw createError(403, "You cannot create booking for other users");
    } else {
      // admin and standard user can create booking for themselves
      booking.createdBy = requestingUser?.id;
    }

    const createdBooking = await this.bookingInteractor.createBooking(booking);

    return res.status(201).send(createdBooking);
  }

  async onGetBooking(req: Request, res: Response) {
    // @TODO: get booking by id or get all bookings for admin user
    // const requestingUser = req.user;
    const { offset = 0, limit = 10 } = req.query;
    const booking = await this.bookingInteractor.getAllBookings(
      parseInt(offset as string),
      parseInt(limit as string)
    );

    return res.status(200).send(booking);
  }

  async onUpdateBooking(req: Request, res: Response) {
    const bookingId = req.params.bookingId as string;
    const booking = req.body;

    const updatedBooking = await this.bookingInteractor.updateBooking(
      bookingId,
      booking
    );

    return res.status(200).send(updatedBooking);
  }

  async onDeleteBooking(req: Request, res: Response) {
    const bookingId = req.params.bookingId as string;

    await this.bookingInteractor.deleteBooking(bookingId);

    return res.status(204).send();
  }
}
