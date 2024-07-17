import { inject, injectable } from "inversify";
import createError from "http-errors";

import {
  IBooking,
  IBookingInteractor,
  IBookingRepository,
} from "../../../typings/Booking";
import { INTERFACE_TYPE } from "../../../utils/constants";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@injectable()
export class BookingInteractor implements IBookingInteractor {
  private bookingRepository: IBookingRepository;

  constructor(
    @inject(INTERFACE_TYPE.BookingRepository)
    bookingRepository: IBookingRepository
  ) {
    this.bookingRepository = bookingRepository;
  }

  async createBooking(booking: IBooking): Promise<IBooking | null> {
    // @TODO: add test case for this scenario
    const existingBooking =
      await this.bookingRepository.checkBookingAvailability(
        booking.parkingSpot,
        booking.startDateTime,
        booking.endDateTime
      );
    if (existingBooking) {
      throw createError(
        409,
        "Spot is already booked for the given Date and Time"
      );
    }

    try {
      const result = await this.bookingRepository.create(booking);
      return result;
    } catch (err: any) {
      // if parking_spot or user not found
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === "P2003"
      ) {
        throw createError(400);
      }
    }

    return null;
  }

  async getBooking(id: string): Promise<IBooking | null> {
    return this.bookingRepository.getById(id);
  }

  async updateBooking(
    id: string,
    booking: Partial<IBooking>,
    createdBy?: string
  ): Promise<IBooking> {
    let { startDateTime, endDateTime } = booking;
    // TODO: check if booking.createdBy is exist in database or not

    // If either startDateTime or endDateTime is missing, fetch the existing booking
    if (!startDateTime || !endDateTime) {
      const existingBooking = await this.bookingRepository.getById(id);
      if (!existingBooking) {
        throw createError(404, "Booking not found");
      }
      startDateTime = startDateTime || existingBooking.startDateTime;
      endDateTime = endDateTime || existingBooking.endDateTime;
    }

    // update startDateTime and endDateTime in booking object
    booking.startDateTime = startDateTime;
    booking.endDateTime = endDateTime;

    // If now we have both startDateTime and endDateTime, check availability
    if (booking.parkingSpot) {
      const isAvailable = await this.bookingRepository.checkBookingAvailability(
        booking.parkingSpot,
        startDateTime,
        endDateTime
      );

      if (isAvailable) {
        throw createError(
          404,
          "Spot is already booked for the given Date and Time"
        );
      }
    }

    if (createdBy) {
      return this.bookingRepository.updateByOwner(id, booking, createdBy);
    }
    return this.bookingRepository.updateById(id, booking);
  }

  async deleteBooking(id: string): Promise<boolean> {
    return this.bookingRepository.delete(id);
  }

  // getAllBookings implementation
  async getAllBookings(
    offset: number,
    limit: number,
    createdBy?: string
  ): Promise<IBooking[]> {
    if (createdBy) {
      // Logic to get all bookings by a specific user
      return this.bookingRepository.getBookingsByOwner(
        offset,
        limit,
        createdBy
      );
    }
    // Logic to get all bookings
    return this.bookingRepository.getAll(offset, limit);
  }
}
