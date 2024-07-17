import { Request, Response } from "express";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { mockReset } from "jest-mock-extended";

import { BookingInteractor } from "../../use-cases/interactors/bookingInteractor";
import { BookingRepository } from "../repositories/bookingRepository";
import bookingContainer from "../containers/bookingContainer";
import { prismaMock } from "../../../db/prismaJest.singleton";

describe("BookingController", () => {
  beforeEach(() => {
    mockReset(prismaMock);
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

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
        expect(err.message).toBe("Unauthorized operation");
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

    // if parkingSpot or forUserId is does not exist in DB it should return 400
    it("should return PrismaClientKnownRequestError if parkingSpot or forUserId is does not exist in DB", async () => {
      const req = mockReq(
        {
          forUserId: "user-1",
          startDateTime: "2024-07-18T01:00:00.000Z",
          endDateTime: "2024-07-18T02:00:00.000Z",
          parkingSpot: "abc-3",
        },
        { id: "user-1", role: "admin" }
      );
      const res = mockRes();

      jest
        .spyOn(BookingRepository.prototype, "checkBookingAvailability")
        .mockResolvedValue(null);

      try {
        await bookingController.onCreateBooking(req, res);
      } catch (err: any) {
        if (err instanceof PrismaClientKnownRequestError) {
          expect(err.code).toBe("P2003");
        }
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

  describe("BookingController onGetBooking", () => {
    const bookingController = bookingContainer;

    const mockReq = (body: any, query: any = {}, user: any) =>
      ({
        body,
        query,
        user,
      } as Request);

    const mockRes = () => {
      const res: Partial<Response> = {};
      res.status = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      return res as Response;
    };

    // pagination test case
    // Standard user success test case
    it("should return 200 and should do DB query with Offset=0, limit=2", async () => {
      const req = mockReq(
        {},
        {
          offset: "0",
          limit: "2",
        },
        { id: "user-1", role: "standard" }
      );
      const res = mockRes();

      const spyGetBookingsByOwner = jest
        .spyOn(BookingRepository.prototype, "getBookingsByOwner")
        .mockResolvedValue([
          {
            id: "booking-1",
            startDateTime: new Date("2024-07-18T01:00:00.000Z"),
            endDateTime: new Date("2024-07-18T02:00:00.000Z"),
            parkingSpot: "abc-1",
            createdBy: "user-1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "booking-2",
            startDateTime: new Date("2024-07-18T02:00:00.000Z"),
            endDateTime: new Date("2024-07-18T03:00:00.000Z"),
            parkingSpot: "abc-2",
            createdBy: "user-1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);

      await bookingController.onGetBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalled();
      expect(spyGetBookingsByOwner).toHaveBeenCalledTimes(1);
      expect(spyGetBookingsByOwner).toHaveBeenCalledWith(0, 2, "user-1");
    });

    // Admin success test case
    it("Should return 200 and return all bookings for Admin user", async () => {
      const req = mockReq({}, {}, { id: "user-1", role: "admin" });
      const res = mockRes();

      const spyGetAll = jest
        .spyOn(BookingRepository.prototype, "getAll")
        .mockResolvedValue([
          {
            id: "booking-1",
            startDateTime: new Date("2024-07-18T01:00:00.000Z"),
            endDateTime: new Date("2024-07-18T02:00:00.000Z"),
            parkingSpot: "abc-1",
            createdBy: "user-1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "booking-2",
            startDateTime: new Date("2024-07-18T02:00:00.000Z"),
            endDateTime: new Date("2024-07-18T03:00:00.000Z"),
            parkingSpot: "abc-2",
            createdBy: "user-2",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);

      await bookingController.onGetBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalled();
      expect(spyGetAll).toHaveBeenCalledTimes(1);
      expect(spyGetAll).toHaveBeenCalledWith(0, 10);
    });

    // Standard user success test case
    it("Should return 200 and return bookings of standard user", async () => {
      const req = mockReq({}, {}, { id: "user-1", role: "standard" });
      const res = mockRes();

      const spyGetBookingsByOwner = jest
        .spyOn(BookingRepository.prototype, "getBookingsByOwner")
        .mockResolvedValue([
          {
            id: "booking-1",
            startDateTime: new Date("2024-07-18T01:00:00.000Z"),
            endDateTime: new Date("2024-07-18T02:00:00.000Z"),
            parkingSpot: "abc-1",
            createdBy: "user-1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);

      await bookingController.onGetBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalled();
      expect(spyGetBookingsByOwner).toHaveBeenCalledTimes(1);
      expect(spyGetBookingsByOwner).toHaveBeenCalledWith(0, 10, "user-1");
    });
  });

  describe("BookingController onUpdateBooking", () => {
    const bookingController = bookingContainer;

    const mockReq = (body: any, query: any = {}, params: any = {}, user: any) =>
      ({
        body,
        query,
        params,
        user,
      } as Request);

    const mockRes = () => {
      const res: Partial<Response> = {};
      res.status = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      return res as Response;
    };

    // Spot is already booked for the given Date and Time
    it("should return 409 if booking already exists for the given parking spot and time", async () => {
      const req = mockReq(
        {
          startDateTime: "2024-07-18T01:00:00.000Z",
          parkingSpot: "abc-1",
        },
        {},
        { bookingId: "booking-1" },
        { id: "user-1", role: "admin" }
      );
      const res = mockRes();

      const spyGetById = jest
        .spyOn(BookingRepository.prototype, "getById")
        .mockResolvedValue({
          id: "booking-1",
          startDateTime: new Date("2024-07-18T01:00:00.000Z"),
          endDateTime: new Date("2024-07-18T02:00:00.000Z"),
          parkingSpot: "abc-1",
          createdBy: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      const spyCheckBookingAvailability = jest
        .spyOn(BookingRepository.prototype, "checkBookingAvailability")
        .mockResolvedValue({
          id: "booking-2",
          startDateTime: new Date("2024-07-18T01:00:00.000Z"),
          endDateTime: new Date("2024-07-18T02:00:00.000Z"),
          parkingSpot: "abc-1",
          createdBy: "user-2",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      try {
        await bookingController.onUpdateBooking(req, res);
      } catch (err: any) {
        expect(err.status).toBe(409);
        expect(err.message).toBe(
          "Spot is already booked for the given Date and Time"
        );
        expect(spyGetById).toHaveBeenCalledTimes(1);
        expect(spyCheckBookingAvailability).toHaveBeenCalledTimes(1);
      }
    });

    // updating booking which does not exist in DB
    it("should return 404 if booking does not exist in DB", async () => {
      const req = mockReq(
        {
          startDateTime: "2024-07-18T01:00:00.000Z",
          parkingSpot: "abc-1",
        },
        {},
        { bookingId: "booking-1" },
        { id: "user-1", role: "admin" }
      );
      const res = mockRes();

      const spyUpdateBooking = jest
        .spyOn(BookingRepository.prototype, "getById")
        .mockResolvedValue(null);

      try {
        await bookingController.onUpdateBooking(req, res);
      } catch (err: any) {
        // httpError: Not Founds
        expect(err.status).toBe(404);
        expect(err.message).toBe("Booking not found");
        expect(spyUpdateBooking).toHaveBeenCalledTimes(1);
      }
    });

    // Invalid request body or bookingId
    it("should return 400 if request body is invalid", async () => {
      const req = mockReq({}, {}, {}, {});
      const res = mockRes();

      try {
        await bookingController.onUpdateBooking(req, res);
      } catch (err: any) {
        const error: ZodError = err;
        expect(error.name).toBe("ZodError");
        expect(error.errors.length).toBe(1);
      }
    });

    // standard user can update only their own booking
    it("should return 403 if standard user tries to update other user's booking", async () => {
      const req = mockReq(
        {
          startDateTime: "2024-07-18T01:00:00.000Z",
          parkingSpot: "abc-1",
        },
        {},
        { bookingId: "booking-1" },
        { id: "user-1", role: "standard" }
      );
      const res = mockRes();

      const spyUpdateBooking = jest
        .spyOn(BookingInteractor.prototype, "updateBooking")
        .mockRejectedValue({
          code: "P2025",
          meta: {
            cause: "Record to update not found.",
            modelName: "bookings",
          },
        });

      try {
        await bookingController.onUpdateBooking(req, res);
      } catch (err: any) {
        expect(err.code).toBe("P2025");
        expect(err.meta.cause).toBe("Record to update not found.");
        expect(spyUpdateBooking).toHaveBeenCalledTimes(1);
      }
    });

    // success test case
    it("should return 200 if booking is updated successfully", async () => {
      const req = mockReq(
        {
          startDateTime: "2024-07-18T01:00:00.000Z",
          endDateTime: "2024-07-18T02:00:00.000Z",
          parkingSpot: "abc-1",
        },
        {},
        { bookingId: "booking-1" },
        { id: "user-1", role: "admin" }
      );
      const res = mockRes();

      const spyUpdateBooking = jest
        .spyOn(BookingInteractor.prototype, "updateBooking")
        .mockResolvedValue({
          id: "booking-1",
          startDateTime: new Date("2024-07-18T01:00:00.000Z"),
          endDateTime: new Date("2024-07-18T02:00:00.000Z"),
          parkingSpot: "abc-1",
          createdBy: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      await bookingController.onUpdateBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalled();
      expect(spyUpdateBooking).toHaveBeenCalledTimes(1);
    });
  });

  describe("BookingController onDeleteBooking", () => {
    const bookingController = bookingContainer;

    const mockReq = (params: any = {}, user: any) =>
      ({
        params,
        user,
      } as Request);

    const mockRes = () => {
      const res: Partial<Response> = {};
      res.status = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      return res as Response;
    };

    // bookingId not found in request params
    it("should return 400 if bookingId not found in request params", async () => {
      const req = mockReq({}, {});
      const res = mockRes();

      try {
        await bookingController.onDeleteBooking(req, res);
      } catch (err: any) {
        const error: ZodError = err;
        expect(error.name).toBe("ZodError");
        expect(error.errors.length).toBe(1);
      }
    });

    // Booking not found in database
    it("should return 404 if booking not found in database", async () => {
      const req = mockReq({ bookingId: "booking-1" }, { id: "user-1" });
      const res = mockRes();

      const spyGetById = jest
        .spyOn(BookingRepository.prototype, "getById")
        .mockResolvedValue(null);

      try {
        await bookingController.onDeleteBooking(req, res);
      } catch (err: any) {
        expect(err.status).toBe(404);
        expect(spyGetById).toHaveBeenCalledTimes(1);
      }
    });

    // standard user can delete only their own booking
    it("should return 403 if standard user tries to delete other user's booking", async () => {
      const req = mockReq(
        { bookingId: "booking-1" },
        { id: "user-1", role: "standard" }
      );
      const res = mockRes();

      const spyGetById = jest
        .spyOn(BookingRepository.prototype, "getById")
        .mockResolvedValue({
          id: "booking-1",
          startDateTime: new Date("2024-07-18T01:00:00.000Z"),
          endDateTime: new Date("2024-07-18T02:00:00.000Z"),
          parkingSpot: "abc-1",
          createdBy: "user-2",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      try {
        await bookingController.onDeleteBooking(req, res);
      } catch (err: any) {
        expect(err.status).toBe(403);
        expect(err.message).toBe("Unauthorized operation");
        expect(spyGetById).toHaveBeenCalledTimes(1);
      }
    });

    // success test case
    it("should return 200 if booking is deleted successfully", async () => {
      const req = mockReq(
        { bookingId: "booking-1" },
        { id: "user-1", role: "admin" }
      );
      const res = mockRes();

      const spyDeleteBooking = jest
        .spyOn(BookingRepository.prototype, "delete")
        .mockResolvedValue(true);

      await bookingController.onDeleteBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
      expect(spyDeleteBooking).toHaveBeenCalledTimes(1);
    });
  });
});
