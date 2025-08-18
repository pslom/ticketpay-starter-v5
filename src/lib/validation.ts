import { z } from "zod";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v: string) => /^\+?[1-9]\d{7,14}$/.test(v); // simple E.164-ish

export const lookupSchema = z
  .object({
    plate: z.string().trim().min(1, "plate required").max(16),
    state: z.string().trim().toUpperCase().length(2, "2-letter state"),
    city: z.string().trim().max(64).optional().default(""),
  })
  .passthrough();

export const subscribeSchema = z
  .object({
    plate: z.string().trim().min(1, "plate required").max(16),
    state: z.string().trim().toUpperCase().length(2, "2-letter state"),
    city: z.string().trim().max(64).optional().default(""),
    channel: z.enum(["email", "sms"]),
    value: z.string().trim().min(1, "value required"),
  })
  .superRefine((d, ctx) => {
    if (d.channel === "email" && !isEmail(d.value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "invalid_email", path: ["value"] });
    }
    if (d.channel === "sms" && !isPhone(d.value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "invalid_phone", path: ["value"] });
    }
  })
  .passthrough();