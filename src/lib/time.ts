import { differenceInCalendarDays } from "date-fns";
export const daysUntil = (iso?: string) =>
  iso ? differenceInCalendarDays(new Date(iso), new Date()) : Infinity;
export const isDueSoon = (iso?: string) => daysUntil(iso) <= 5;
