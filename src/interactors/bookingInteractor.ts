import { inject, injectable } from "inversify";
import {
  IBooking,
  IBookingInteractor,
  IBookingRepository,
} from "../typings/Booking";
import { INTERFACE_TYPE } from "../utils/constants";

@injectable()
export class BookingInteractor implements IBookingInteractor {
  private bookingRepository: IBookingRepository;

  constructor(
    @inject(INTERFACE_TYPE.BookingRepository)
    bookingRepository: IBookingRepository
  ) {
    this.bookingRepository = bookingRepository;
  }

  async createBooking(booking: IBooking): Promise<IBooking> {
    return this.bookingRepository.create(booking);
  }
  async getBooking(id: string): Promise<IBooking> {
    return this.bookingRepository.getById(id);
  }
  async updateBooking(id: string, booking: IBooking): Promise<IBooking> {
    return this.bookingRepository.update(id, booking);
  }
  async deleteBooking(id: string): Promise<boolean> {
    return this.bookingRepository.delete(id);
  }

  // getAllBookings Overload signatures
  getAllBookings(offset: number, limit: number): Promise<IBooking[]>;
  getAllBookings(
    offset: number,
    limit: number,
    createdBy: string
  ): Promise<IBooking[]>;

  // getAllBookings implementation
  async getAllBookings(
    offset: number,
    limit: number,
    createdBy?: string
  ): Promise<IBooking[]> {
    if (createdBy) {
      // Logic to get all bookings by a specific user
      return this.getBookingsByCreatedByUser(offset, limit, createdBy);
    } else {
      // Logic to get all bookings
      return this.getAllBookingsFromDb(offset, limit);
    }
  }

  private async getBookingsByCreatedByUser(
    offset: number,
    limit: number,
    createdBy: string
  ): Promise<IBooking[]> {
    return this.bookingRepository.getAll(offset, limit, createdBy);
  }

  private async getAllBookingsFromDb(
    offset: number,
    limit: number
  ): Promise<IBooking[]> {
    return this.bookingRepository.getAll(offset, limit);
  }
}
