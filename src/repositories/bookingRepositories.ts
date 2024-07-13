import { Pool } from "pg";

import { pgClient } from "../db/dbConnector";
import { IBooking, IBookingRepository } from "../typings/Booking";

export class BookingRepository implements IBookingRepository {
  private dbClient: Pool;

  constructor() {
    this.dbClient = pgClient();
  }

  create(booking: IBooking): Promise<IBooking> {
    throw new Error("Method not implemented.");
  }
  async getById(id: string): Promise<IBooking> {
    const data = await this.dbClient.query(
      "SELECT * FROM bookings WHERE id = $1",
      [id]
    );

    return data.rows[0];
  }
  update(id: string, booking: IBooking): Promise<IBooking> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  // getAllBookings Overload signatures
  getAll(offset: number, limit: number): Promise<IBooking[]>;
  getAll(offset: number, limit: number, createdBy: string): Promise<IBooking[]>;

  // getAllBookings implementation
  getAll(
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

  private async getBookingsByCreatedByUser(
    offset: number,
    limit: number,
    createdBy: string
  ): Promise<IBooking[]> {
    throw new Error("Method not implemented.");
  }
  private async getAllBookingsFromDb(
    offset: number,
    limit: number
  ): Promise<IBooking[]> {
    throw new Error("Method not implemented.");
  }
}
