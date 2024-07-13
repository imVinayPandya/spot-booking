export class BookingInteractor implements IBookingInteractor {
  createBooking(booking: IBooking): Promise<IBooking> {
    throw new Error("Method not implemented.");
  }
  getBooking(id: string): Promise<IBooking> {
    throw new Error("Method not implemented.");
  }
  updateBooking(id: string, booking: IBooking): Promise<IBooking> {
    throw new Error("Method not implemented.");
  }
  deleteBooking(id: string): Promise<IBooking> {
    throw new Error("Method not implemented.");
  }
  getAllBookings(createdBy: string): Promise<IBooking[]> {
    throw new Error("Method not implemented.");
  }
}
