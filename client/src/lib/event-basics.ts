export const eventTypes = ["Wedding", "Corporate", "College Fest", "Birthday", "Other"] as const;

export const categories = [
  { value: "planner", label: "Event Planner", description: "Planning, styling & coordination" },
  { value: "performer", label: "Performer", description: "Music, dance & entertainment" },
  { value: "crew", label: "Crew", description: "People to support your event" },
] as const;

export type EventBasics = {
  eventName: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  category: "" | "planner" | "performer" | "crew";
};

export type BasicsErrors = Partial<Record<keyof EventBasics, string>>;

export const initialBasics: EventBasics = {
  eventName: "", eventType: "", startDate: "", endDate: "",
  location: "", venue: "", category: "",
};

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateBasics(values: EventBasics): BasicsErrors {
  const errors: BasicsErrors = {};
  if (!values.eventName.trim()) errors.eventName = "Enter your event name.";
  if (!eventTypes.some((type) => type === values.eventType)) errors.eventType = "Choose an event type.";
  if (!validDate(values.startDate)) errors.startDate = "Choose a valid start date.";
  if (values.endDate && !validDate(values.endDate)) errors.endDate = "Choose a valid end date.";
  else if (values.endDate && !errors.startDate && values.endDate < values.startDate) {
    errors.endDate = "End date must be on or after the start date.";
  }
  if (!values.location.trim()) errors.location = "Enter the event city or address.";
  if (!categories.some((category) => category.value === values.category)) errors.category = "Choose a category.";
  return errors;
}
