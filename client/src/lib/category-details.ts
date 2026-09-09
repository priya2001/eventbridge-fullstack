import type { EventBasics } from "@/lib/event-basics";

export type CategoryDetails = {
  plannerService: string;
  guestCount: string;
  plannerServices: string[];
  performerType: string;
  performerStyle: string;
  crewRole: string;
  crewCount: string;
};

export type CategoryDetailsErrors = Partial<Record<keyof CategoryDetails, string>>;

export const initialCategoryDetails: CategoryDetails = {
  plannerService: "", guestCount: "", plannerServices: [],
  performerType: "", performerStyle: "", crewRole: "", crewCount: "",
};

export const plannerServices = ["Event planning", "Decoration & styling", "Vendor coordination", "On-site coordination"];
export const performerTypes = ["Singer", "DJ", "Band", "Dancer", "Emcee / Host", "Comedian", "Other"];
export const crewRoles = ["Photographer", "Videographer", "Security staff", "Technical crew", "Event volunteers", "Hospitality staff"];

export function validateCategoryDetails(basics: EventBasics, details: CategoryDetails): CategoryDetailsErrors {
  const errors: CategoryDetailsErrors = {};
  if (basics.category === "planner") {
    if (!plannerServices.includes(details.plannerService)) errors.plannerService = "Choose a primary planning need.";
    if (!/^[1-9]\d*$/.test(details.guestCount)) errors.guestCount = "Enter an expected guest count greater than zero.";
    if (!details.plannerServices.length) errors.plannerServices = "Choose at least one service.";
  }
  if (basics.category === "performer") {
    if (!performerTypes.includes(details.performerType)) errors.performerType = "Choose a performer type.";
    if (!details.performerStyle.trim()) errors.performerStyle = "Tell us the preferred genre or style.";
  }
  if (basics.category === "crew") {
    if (!crewRoles.includes(details.crewRole)) errors.crewRole = "Choose a crew role.";
    if (!/^[1-9]\d*$/.test(details.crewCount)) errors.crewCount = "Enter the number of people needed.";
  }
  return errors;
}
