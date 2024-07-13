interface IBooking {
  id: string;
  createdBy: string;
  startDateTime: Date;
  endDateTime: Date;
  parkingSpot: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IBookingInteractor {
  createBooking(booking: IBooking): Promise<IBooking>;
  getBooking(id: string): Promise<IBooking>;
  updateBooking(id: string, booking: IBooking): Promise<IBooking>;
  deleteBooking(id: string): Promise<IBooking>;
  getAllBookings(createdBy: string): Promise<IBooking[]>;
}
