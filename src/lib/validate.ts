import { z } from "zod";

export const lookupSchema = z.object({
  plate: z.string().min(2).max(12),
  state: z.string().min(2).max(3),
  city: z.string().optional(),
});

export const subscribeSchema = z.object({
  plate: z.string().min(2).max(12),
  state: z.string().min(2).max(3),
  channel: z.enum(["sms", "email"]),
  value: z.string().min(3).max(255),
  city: z.string().optional(),
});

export const listSchema = z.object({
  plate: z.string().min(2).max(12),
  state: z.string().min(2).max(3),
  city: z.string().optional(),
});

export const unsubscribeSchema = z.object({
  subscription_id: z.string().uuid(),
});
