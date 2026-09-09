import type { EventBasics } from "@/lib/event-basics";

export type RequirementDetails = {
  budgetMin: string;
  budgetMax: string;
  preferredTime: string;
  durationHours: string;
  notes: string;
};

export type RequirementErrors = Partial<Record<keyof RequirementDetails, string>>;

export const initialRequirementDetails: RequirementDetails = {
  budgetMin: "", budgetMax: "", preferredTime: "", durationHours: "", notes: "",
};

export function durationLabel(category: EventBasics["category"]) {
  if (category === "performer") return "Performance duration (hours)";
  if (category === "crew") return "Shift duration (hours)";
  return "Planning support (hours)";
}

export function validateRequirementDetails(details: RequirementDetails): RequirementErrors {
  const errors: RequirementErrors = {};
  const min = Number(details.budgetMin);
  const max = Number(details.budgetMax);
  if (!details.budgetMin.trim() || !Number.isInteger(min) || min < 0) errors.budgetMin = "Enter a valid minimum budget.";
  if (!details.budgetMax.trim() || !Number.isInteger(max) || max < 0) errors.budgetMax = "Enter a valid maximum budget.";
  if (!errors.budgetMin && !errors.budgetMax && min > max) errors.budgetMax = "Maximum budget must be at least the minimum budget.";
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(details.preferredTime)) errors.preferredTime = "Choose a preferred start time.";
  const duration = Number(details.durationHours);
  if (!Number.isFinite(duration) || duration <= 0 || duration > 24) errors.durationHours = "Enter a duration between 0.5 and 24 hours.";
  return errors;
}
