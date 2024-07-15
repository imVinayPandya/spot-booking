import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";
import { objectToSnake, objectToCamel } from "ts-case-convert";

import { IBooking, IBookingRepository } from "../typings/Booking";

@injectable()
export class BookingRepository implements IBookingRepository {
  private dbClient: PrismaClient;

  constructor() {
    this.dbClient = new PrismaClient();
  }

  async create(booking: IBooking): Promise<IBooking> {
    const data = await this.dbClient.bookings.create({
      data: objectToSnake(booking),
    });
    return objectToCamel(data);
  }

  async getById(id: string): Promise<IBooking | null> {
    const data = await this.dbClient.bookings.findUnique({
      where: {
        id,
      },
    });

    return data ? objectToCamel(data) : data;
  }

  // @TODO: allow Partial<IBooking> to do a patch update
  async update(id: string, booking: Partial<IBooking>): Promise<IBooking> {
    const data = await this.dbClient.bookings.update({
      where: {
        id,
      },
      data: objectToSnake(booking),
    });

    return objectToCamel(data);
  }

  async delete(id: string): Promise<boolean> {
    const data = await this.dbClient.bookings.delete({
      where: {
        id,
      },
    });

    return !!data;
  }

  // getAllBookings Overload signatures
  getAll(offset: number, limit: number): Promise<IBooking[]>;
  getAll(offset: number, limit: number, createdBy: string): Promise<IBooking[]>;

  // getAllBookings implementation
  async getAll(
    offset: number,
    limit: number,
    createdBy?: string
  ): Promise<IBooking[]> {
    if (createdBy) {
      return this.getBookingsByCreatedByUser(offset, limit, createdBy);
    } else {
      return this.getAllBookingsFromDb(offset, limit);
    }
  }

  async checkBookingAvailability(
    parkingSpotId: string,
    startDateTime: Date,
    endDateTime: Date
  ): Promise<IBooking | null> {
    const data = await this.dbClient.bookings.findFirst({
      where: {
        parking_spot: parkingSpotId,
        NOT: [
          {
            start_date_time: {
              gte: endDateTime,
            },
          },
          {
            end_date_time: {
              lte: startDateTime,
            },
          },
        ],
      },
    });

    return data ? objectToCamel(data) : data;
  }

  // ---------- Private functions ----------

  private async getBookingsByCreatedByUser(
    offset: number,
    limit: number,
    createdBy: string
  ): Promise<IBooking[]> {
    const data = await this.dbClient.bookings.findMany({
      where: {
        created_by: createdBy,
      },
      skip: offset,
      take: limit,
    });

    return objectToCamel(data);
  }

  private async getAllBookingsFromDb(
    offset: number,
    limit: number
  ): Promise<IBooking[]> {
    const data = await this.dbClient.bookings.findMany({
      skip: offset,
      take: limit,
    });

    return objectToCamel(data);
  }
}
