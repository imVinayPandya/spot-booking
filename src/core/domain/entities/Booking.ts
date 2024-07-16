import { IBooking } from "../../../typings/Booking";

/**
 * Booking entity class
 */
export class Booking implements Readonly<IBooking> {
  constructor(
    public id: string,
    public createdBy: string,
    public startDateTime: Date,
    public endDateTime: Date,
    public parkingSpot: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
