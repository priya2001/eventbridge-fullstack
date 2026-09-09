import mongoose from "mongoose";

const requirementSchema = new mongoose.Schema({
  eventName: { type: String, required: true, trim: true, maxlength: 150 },
  eventType: { type: String, required: true, enum: ["Wedding", "Corporate", "College Fest", "Birthday", "Other"] },
  startDate: { type: String, required: true },
  endDate: { type: String, default: "" },
  location: { type: String, required: true, trim: true, maxlength: 300 },
  venue: { type: String, default: "", trim: true, maxlength: 200 },
  category: { type: String, required: true, enum: ["planner", "performer", "crew"], index: true },
  categoryDetails: { type: mongoose.Schema.Types.Mixed, required: true },
  requirementDetails: {
    budgetMin: { type: Number, required: true, min: 0 },
    budgetMax: { type: Number, required: true, min: 0 },
    preferredTime: { type: String, required: true },
    durationHours: { type: Number, required: true, min: 0.5, max: 24 },
    notes: { type: String, default: "", maxlength: 1000 },
  },
}, { timestamps: true, versionKey: false });

export const Requirement = mongoose.models.Requirement || mongoose.model("Requirement", requirementSchema);
