import type { EventBasics } from "@/lib/event-basics";
import type { CategoryDetails } from "@/lib/category-details";
import type { RequirementDetails } from "@/lib/requirement-details";

export function buildRequirementPayload(basics: EventBasics, details: CategoryDetails, requirements: RequirementDetails) {
  const categoryDetails = basics.category === "planner"
    ? { plannerService: details.plannerService, guestCount: Number(details.guestCount), plannerServices: details.plannerServices }
    : basics.category === "performer"
      ? { performerType: details.performerType, performerStyle: details.performerStyle.trim() }
      : { crewRole: details.crewRole, crewCount: Number(details.crewCount) };
  return {
    ...basics,
    eventName: basics.eventName.trim(), location: basics.location.trim(), venue: basics.venue.trim(),
    categoryDetails,
    requirementDetails: {
      budgetMin: Number(requirements.budgetMin), budgetMax: Number(requirements.budgetMax),
      preferredTime: requirements.preferredTime, durationHours: Number(requirements.durationHours), notes: requirements.notes.trim(),
    },
  };
}
