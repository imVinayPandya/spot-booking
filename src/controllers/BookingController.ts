import { Request, Response } from "express";

export class BookingController {
  async onCreateBooking(req: Request, res: Response) {}

  async onGetBooking(req: Request, res: Response) {
    return res.status(200).send({ message: "GET /bookings" });
  }

  async onUpdateBooking(req: Request, res: Response) {}

  async onDeleteBooking(req: Request, res: Response) {}
}
