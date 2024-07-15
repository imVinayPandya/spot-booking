import { z } from "zod";

// ---------- Common ----------
export const cuidSchema = z.string().cuid();

export const offsetLimitSchema = z
  .object({
    offset: z.number().int().min(0).positive().optional(),
    limit: z.number().int().min(10).positive().optional(),
  })
  .strip();

// ---------- Bookings ----------

export const createBookingSchema = z
  .object({
    forUserId: z.string().cuid().optional(),
    startDateTime: z.date(),
    endDateTime: z.date(),
    parkingSpot: z.string(),
  })
  .strip();

export const updateBookingSchema = z
  .object({
    startDateTime: z.date().optional(),
    endDateTime: z.date().optional(),
    parkingSpot: z.string().optional(),
  })
  .strip();
