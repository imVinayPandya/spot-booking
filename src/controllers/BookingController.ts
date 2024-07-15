import { Request, Response } from "express";
import { inject, injectable } from "inversify";

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
    // @TODO: add zod validation
    const booking = req.body;

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
