import { Request, Response } from "express";
import { BookingInteractor } from "../../use-cases/interactors/bookingInteractor";
import { BookingRepository } from "../repositories/bookingRepository";
import bookingContainer from "../containers/bookingContainer";
import { ZodError } from "zod";

describe("BookingController onCreateBooking", () => {
  const bookingController = bookingContainer;

  const mockReq = (body: any, user: any) =>
    ({
      body,
      user,
    } as Request);

  const mockRes = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  it("should return 400 if request body is invalid", async () => {
    const req = mockReq({}, {});
    const res = mockRes();

    try {
      await bookingController.onCreateBooking(req, res);
    } catch (err: any) {
      const error: ZodError = err;
      expect(error.name).toBe("ZodError");
      expect(error.errors.length).toBe(3);
    }
  });

  // endDateTime must be greater than startDateTime
  it("should return 400 if endDateTime should be greater than startDateTime", async () => {
    const req = mockReq(
      {
        forUserId: "use-1",
        startDateTime: "2024-07-18T02:00:00.000Z",
        endDateTime: "2024-07-18T01:00:00.000Z",
        parkingSpot: "abc-1",
      },
      {}
    );
    const res = mockRes();

    try {
      await bookingController.onCreateBooking(req, res);
    } catch (err: any) {
      // ZodError: [
      //   {
      //     "code": "custom",
      //     "message": "endDateTime must be greater than startDateTime",
      //     "path": [
      //       "endDateTime"
      //     ]
      //   }
      // ]
      const error: ZodError = err;
      expect(error.name).toBe("ZodError");
      expect(error.errors.length).toBe(1);
      expect(error.errors[0].message).toBe(
        "endDateTime must be greater than startDateTime"
      );
    }
  });

  // req.user role is admin, forUserId should be allowed. For standard user, forUserId should not be allowed
  it("should return 403 if standard user tries to create booking for other users", async () => {
    const req = mockReq(
      {
        forUserId: "use-1",
        startDateTime: "2024-07-18T01:00:00.000Z",
        endDateTime: "2024-07-18T02:00:00.000Z",
        parkingSpot: "abc-1",
      },
      { id: "user-1", role: "standard" }
    );
    const res = mockRes();

    try {
      await bookingController.onCreateBooking(req, res);
    } catch (err: any) {
      // HttpError: Forbidden
      expect(err.status).toBe(403);
      expect(err.message).toBe("You cannot create booking for other users");
    }
  });

  // if booking already exists for the given parking spot and time, it should return 409
  it("should return 409 if booking already exists for the given parking spot and time", async () => {
    const req = mockReq(
      {
        forUserId: "use-1",
        startDateTime: "2024-07-18T01:00:00.000Z",
        endDateTime: "2024-07-18T02:00:00.000Z",
        parkingSpot: "abc-1",
      },
      { id: "user-1", role: "admin" }
    );
    const res = mockRes();

    const spyCreateBooking = jest
      .spyOn(BookingRepository.prototype, "checkBookingAvailability")
      .mockResolvedValue({
        id: "booking-1",
        startDateTime: new Date("2024-07-18T01:00:00.000Z"),
        endDateTime: new Date("2024-07-18T02:00:00.000Z"),
        parkingSpot: "abc-1",
        createdBy: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    try {
      await bookingController.onCreateBooking(req, res);
    } catch (err: any) {
      expect(err.status).toBe(409);
      expect(err.message).toBe(
        "Spot is already booked for the given Date and Time"
      );
      expect(spyCreateBooking).toHaveBeenCalledTimes(1);
    }
  });

  // success test case
  it("should return 201 if booking is created successfully", async () => {
    const req = mockReq(
      {
        forUserId: "use-1",
        startDateTime: "2024-07-18T01:00:00.000Z",
        endDateTime: "2024-07-18T02:00:00.000Z",
        parkingSpot: "abc-1",
      },
      { id: "user-1", role: "admin" }
    );
    const res = mockRes();

    const spyCreateBooking = jest
      .spyOn(BookingInteractor.prototype, "createBooking")
      .mockResolvedValue({
        id: "booking-1",
        startDateTime: new Date("2024-07-18T01:00:00.000Z"),
        endDateTime: new Date("2024-07-18T02:00:00.000Z"),
        parkingSpot: "abc-1",
        createdBy: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    await bookingController.onCreateBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalled();
    expect(spyCreateBooking).toHaveBeenCalledTimes(1);
  });
});
