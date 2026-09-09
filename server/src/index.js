import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { Requirement } from "./requirement.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.disable("x-powered-by");
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "100kb" }));

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validateRequirement(payload) {
  const errors = {};
  if (!payload || typeof payload !== "object") return { body: "A JSON request body is required." };
  if (typeof payload.eventName !== "string" || !payload.eventName.trim()) errors.eventName = "Event name is required.";
  if (!["Wedding", "Corporate", "College Fest", "Birthday", "Other"].includes(payload.eventType)) errors.eventType = "Choose a valid event type.";
  if (!isValidDate(payload.startDate)) errors.startDate = "Choose a valid start date.";
  if (payload.endDate && (!isValidDate(payload.endDate) || payload.endDate < payload.startDate)) errors.endDate = "End date must be valid and on or after start date.";
  if (typeof payload.location !== "string" || !payload.location.trim()) errors.location = "Location is required.";
  if (!["planner", "performer", "crew"].includes(payload.category)) errors.category = "Choose a valid category.";
  if (!payload.categoryDetails || typeof payload.categoryDetails !== "object") errors.categoryDetails = "Category details are required.";
  if (payload.category === "planner") {
    const details = payload.categoryDetails || {};
    if (typeof details.plannerService !== "string" || !details.plannerService) errors.categoryDetails = "Planner details are incomplete.";
    if (!Number.isInteger(details.guestCount) || details.guestCount < 1 || !Array.isArray(details.plannerServices) || !details.plannerServices.length) errors.categoryDetails = "Planner details are incomplete.";
  }
  if (payload.category === "performer") {
    const details = payload.categoryDetails || {};
    if (typeof details.performerType !== "string" || !details.performerType || typeof details.performerStyle !== "string" || !details.performerStyle.trim()) errors.categoryDetails = "Performer details are incomplete.";
  }
  if (payload.category === "crew") {
    const details = payload.categoryDetails || {};
    if (typeof details.crewRole !== "string" || !details.crewRole || !Number.isInteger(details.crewCount) || details.crewCount < 1) errors.categoryDetails = "Crew details are incomplete.";
  }
  const requirementDetails = payload.requirementDetails || {};
  if (!Number.isInteger(requirementDetails.budgetMin) || requirementDetails.budgetMin < 0) errors.budgetMin = "A valid minimum budget is required.";
  if (!Number.isInteger(requirementDetails.budgetMax) || requirementDetails.budgetMax < requirementDetails.budgetMin) errors.budgetMax = "Maximum budget must be at least the minimum budget.";
  if (typeof requirementDetails.preferredTime !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(requirementDetails.preferredTime)) errors.preferredTime = "A valid preferred start time is required.";
  if (typeof requirementDetails.durationHours !== "number" || requirementDetails.durationHours < 0.5 || requirementDetails.durationHours > 24) errors.durationHours = "Duration must be between 0.5 and 24 hours.";
  return errors;
}

async function ensureDatabase() {
  if (!process.env.MONGODB_URI) {
    const error = new Error("MONGODB_URI is not configured.");
    error.code = "DATABASE_NOT_CONFIGURED";
    throw error;
  }
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
}

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "eventbridge-api", database: mongoose.connection.readyState === 1 ? "connected" : "not-connected" });
});

app.post("/api/requirements", async (req, res, next) => {
  try {
    const errors = validateRequirement(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ message: "Validation failed.", errors });
    await ensureDatabase();
    const requirement = await Requirement.create(req.body);
    return res.status(201).json({ message: "Requirement created successfully.", requirement: { id: requirement.id, category: requirement.category, createdAt: requirement.createdAt } });
  } catch (error) {
    if (error.code === "DATABASE_NOT_CONFIGURED") return res.status(503).json({ message: "Database is not configured. Add MONGODB_URI to server/.env." });
    return next(error);
  }
});

app.use((_req, res) => res.status(404).json({ message: "Route not found" }));
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Unable to save the requirement right now." });
});

app.listen(port, () => console.log(`EventBridge API running at http://localhost:${port}`));
