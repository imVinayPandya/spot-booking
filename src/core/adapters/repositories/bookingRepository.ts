import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";
import { objectToSnake, objectToCamel } from "ts-case-convert";

import { IBooking, IBookingRepository } from "../../../typings/Booking";

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

  async updateById(id: string, booking: Partial<IBooking>): Promise<IBooking> {
    const data = await this.dbClient.bookings.update({
      where: {
        id,
      },
      data: objectToSnake(booking),
    });

    return objectToCamel(data);
  }

  async updateByOwner(
    id: string,
    booking: Partial<IBooking>,
    createdBy: string
  ): Promise<IBooking> {
    const data = await this.dbClient.bookings.update({
      where: {
        id,
        created_by: createdBy,
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

  // Check booking spot availability
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

  async getBookingsByOwner(
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

  async getAll(offset: number, limit: number): Promise<IBooking[]> {
    const data = await this.dbClient.bookings.findMany({
      skip: offset,
      take: limit,
    });

    return objectToCamel(data);
  }
}
