export interface IBooking {
  id: string;
  createdBy: string;
  startDateTime: Date;
  endDateTime: Date;
  parkingSpot: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookingInteractor {
  createBooking(booking: IBooking): Promise<IBooking | null>;
  getBooking(id: string): Promise<IBooking | null>;
  updateBooking(
    id: string,
    booking: Partial<IBooking>,
    createdBy?: string
  ): Promise<IBooking>;
  deleteBooking(id: string): Promise<boolean>;
  // getAllBookings(offset: number, limit: number): Promise<IBooking[]>;
  getAllBookings(
    offset: number,
    limit: number,
    createdBy?: string
  ): Promise<IBooking[]>;
}

export interface IBookingRepository {
  create(booking: IBooking): Promise<IBooking>;
  getById(id: string): Promise<IBooking | null>;
  updateById(id: string, booking: Partial<IBooking>): Promise<IBooking>;
  updateByOwner(
    id: string,
    booking: Partial<IBooking>,
    createdBy: string
  ): Promise<IBooking>;
  delete(id: string): Promise<boolean>;
  getBookingsByOwner(
    offset: number,
    limit: number,
    createdBy: string
  ): Promise<IBooking[]>;
  getAll(offset: number, limit: number): Promise<IBooking[]>;
  checkBookingAvailability(
    parkingSpotId: string,
    startDateTime: Date,
    endDateTime: Date
  ): Promise<IBooking | null>;
}
