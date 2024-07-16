import { z } from "zod";

// ---------- Common ----------
export const stringSchema = z.string();

export const offsetLimitSchema = z
  .object({
    offset: z
      .string()
      .transform((value) => parseInt(value, 10))
      .optional(),
    limit: z
      .string()
      .transform((value) => parseInt(value, 10))
      .optional(),
  })
  .strip();

const preProcessedDateSchema = z.preprocess((arg) => {
  if (typeof arg === "string") {
    const date = new Date(arg);
    return isNaN(date.getTime()) ? undefined : date; // Return the date if valid, otherwise undefined
  }
  return arg; // Return as is if not a string
}, z.date());

// ---------- Bookings ----------

export const createBookingSchema = z
  .object({
    forUserId: z.string().optional(),
    startDateTime: preProcessedDateSchema,
    endDateTime: preProcessedDateSchema,
    parkingSpot: z.string(),
  })
  .strip()
  .refine(
    (data) => {
      if (data.endDateTime && data.startDateTime) {
        return data.endDateTime > data.startDateTime;
      } else {
        return data;
      }
    },
    {
      message: "endDateTime must be greater than startDateTime",
      path: ["endDateTime"], // Optional: specify the path to the field this error is associated with
    }
  );

export const updateBookingSchema = z
  .object({
    startDateTime: preProcessedDateSchema.optional(),
    endDateTime: preProcessedDateSchema.optional(),
    parkingSpot: z.string().optional(),
  })
  .strip()
  .refine(
    (data) => {
      if (data.endDateTime && data.startDateTime) {
        return data.endDateTime > data.startDateTime;
      } else {
        return data;
      }
    },
    {
      message: "endDateTime must be greater than startDateTime",
      path: ["endDateTime"], // Optional: specify the path to the field this error is associated with
    }
  );
