"use client";

import { useState, type FormEvent } from "react";
import { categories, eventTypes, initialBasics, validateBasics, type EventBasics } from "@/lib/event-basics";
import { crewRoles, initialCategoryDetails, performerTypes, plannerServices, validateCategoryDetails, type CategoryDetails } from "@/lib/category-details";

const steps = ["Event basics", "Category details", "Requirements", "Review & submit"];

export default function EventBasicsForm() {
  const [step, setStep] = useState(1);
  const [basics, setBasics] = useState<EventBasics>(initialBasics);
  const [details, setDetails] = useState<CategoryDetails>(initialCategoryDetails);
  const [attempted, setAttempted] = useState(false);
  const [detailsComplete, setDetailsComplete] = useState(false);
  const basicsErrors = attempted && step === 1 ? validateBasics(basics) : {};
  const detailsErrors = attempted && step === 2 ? validateCategoryDetails(basics, details) : {};

  function updateBasics<K extends keyof EventBasics>(field: K, value: EventBasics[K]) {
    setBasics((current) => ({ ...current, [field]: value }));
  }
  function updateDetails<K extends keyof CategoryDetails>(field: K, value: CategoryDetails[K]) {
    setDetails((current) => ({ ...current, [field]: value }));
    setDetailsComplete(false);
  }
  function nextFromBasics(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setAttempted(true);
    const errors = validateBasics(basics);
    if (Object.keys(errors).length) return;
    setAttempted(false); setStep(2);
  }
  function nextFromDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setAttempted(true);
    const errors = validateCategoryDetails(basics, details);
    if (Object.keys(errors).length) return;
    setAttempted(false); setDetailsComplete(true);
  }
  function togglePlannerService(service: string) {
    updateDetails("plannerServices", details.plannerServices.includes(service)
      ? details.plannerServices.filter((item) => item !== service)
      : [...details.plannerServices, service]);
  }
  const inputClass = (hasError: boolean) => `mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 ${hasError ? "border-red-500" : "border-slate-300"}`;
  const error = (message?: string, id?: string) => message ? <p id={id} className="mt-2 text-sm text-red-700">{message}</p> : null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-5"><div className="mx-auto flex max-w-4xl items-center gap-3"><span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-800 font-bold text-white">E</span><span className="text-xl font-bold tracking-tight">EventBridge</span></div></header>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-widest text-teal-700">Post a requirement</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Let’s bring your event to life.</h1><p className="mt-3 text-slate-600">Tell us what you’re planning and who you need.</p>
        <nav aria-label="Form progress" className="my-8"><ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">{steps.map((label, index) => <li key={label} aria-current={step === index + 1 ? "step" : undefined} className={`flex items-center gap-2 rounded-xl px-3 py-3 text-sm ${step === index + 1 ? "bg-teal-100 font-semibold text-teal-900" : index + 1 < step ? "text-teal-800" : "text-slate-500"}`}><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${step === index + 1 ? "bg-teal-800 text-white" : index + 1 < step ? "bg-teal-200" : "border border-slate-300 bg-white"}`}>{index + 1}</span>{label}</li>)}</ol></nav>
        {step === 1 ? <form noValidate onSubmit={nextFromBasics} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7 border-b border-slate-100 pb-6"><p className="text-sm font-medium text-teal-700">Step 1 of 4</p><h2 className="mt-1 text-2xl font-semibold">Event basics</h2><p className="mt-2 text-sm text-slate-500">All fields are required unless marked optional.</p></div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div><label htmlFor="eventName" className="text-sm font-semibold">Event name</label><input id="eventName" name="eventName" value={basics.eventName} required maxLength={150} placeholder="e.g. Annual College Fest" onChange={(e) => updateBasics("eventName", e.target.value)} aria-invalid={!!basicsErrors.eventName} className={inputClass(!!basicsErrors.eventName)} />{error(basicsErrors.eventName)}</div>
            <div><label htmlFor="eventType" className="text-sm font-semibold">Event type</label><select id="eventType" name="eventType" value={basics.eventType} required onChange={(e) => updateBasics("eventType", e.target.value)} aria-invalid={!!basicsErrors.eventType} className={inputClass(!!basicsErrors.eventType)}><option value="">Select event type</option>{eventTypes.map((type) => <option key={type}>{type}</option>)}</select>{error(basicsErrors.eventType)}</div>
            <div><label htmlFor="startDate" className="text-sm font-semibold">Start date</label><input id="startDate" name="startDate" value={basics.startDate} required type="date" onChange={(e) => updateBasics("startDate", e.target.value)} aria-invalid={!!basicsErrors.startDate} className={inputClass(!!basicsErrors.startDate)} />{error(basicsErrors.startDate)}</div>
            <div><label htmlFor="endDate" className="text-sm font-semibold">End date <span className="font-normal text-slate-500">(optional)</span></label><input id="endDate" name="endDate" value={basics.endDate} type="date" min={basics.startDate || undefined} onChange={(e) => updateBasics("endDate", e.target.value)} aria-invalid={!!basicsErrors.endDate} className={inputClass(!!basicsErrors.endDate)} /><p className="mt-2 text-xs text-slate-500">Leave blank for a single-day event.</p>{error(basicsErrors.endDate)}</div>
            <div><label htmlFor="location" className="text-sm font-semibold">Location</label><input id="location" name="location" value={basics.location} required maxLength={300} placeholder="City or event address" onChange={(e) => updateBasics("location", e.target.value)} aria-invalid={!!basicsErrors.location} className={inputClass(!!basicsErrors.location)} />{error(basicsErrors.location)}</div>
            <div><label htmlFor="venue" className="text-sm font-semibold">Venue <span className="font-normal text-slate-500">(optional)</span></label><input id="venue" name="venue" value={basics.venue} maxLength={200} placeholder="e.g. City Convention Centre" onChange={(e) => updateBasics("venue", e.target.value)} className={inputClass(false)} /></div>
          </div>
          <fieldset className="mt-8"><legend className="text-sm font-semibold">Who are you looking for?</legend><p className="mt-1 text-sm text-slate-500">Choose one category for this requirement.</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{categories.map((category) => <label key={category.value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition focus-within:ring-2 focus-within:ring-teal-700 ${basics.category === category.value ? "border-teal-700 bg-teal-50" : "border-slate-300 hover:bg-slate-50"}`}><input type="radio" name="category" value={category.value} checked={basics.category === category.value} onChange={() => updateBasics("category", category.value)} className="mt-1 h-4 w-4 accent-teal-800" /><span><span className="block text-sm font-semibold">{category.label}</span><span className="mt-1 block text-xs leading-5 text-slate-600">{category.description}</span></span></label>)}</div>{error(basicsErrors.category)}</fieldset>
          {Object.keys(basicsErrors).length > 0 && <p className="mt-6 text-sm text-red-700">Please fix the highlighted fields to continue.</p>}<Footer />
        </form> : <form noValidate onSubmit={nextFromDetails} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7 border-b border-slate-100 pb-6"><p className="text-sm font-medium text-teal-700">Step 2 of 4</p><h2 className="mt-1 text-2xl font-semibold">Category details</h2><p className="mt-2 text-sm text-slate-500">Tell us what you need for your {categories.find((item) => item.value === basics.category)?.label.toLowerCase()} requirement.</p></div>
          {basics.category === "planner" && <PlannerDetails details={details} errors={detailsErrors} update={updateDetails} toggle={togglePlannerService} inputClass={inputClass} error={error} />}
          {basics.category === "performer" && <PerformerDetails details={details} errors={detailsErrors} update={updateDetails} inputClass={inputClass} error={error} />}
          {basics.category === "crew" && <CrewDetails details={details} errors={detailsErrors} update={updateDetails} inputClass={inputClass} error={error} />}
          {detailsComplete && <p className="mt-6 rounded-xl bg-teal-50 p-4 text-sm leading-6 text-teal-900">Category details are complete. Step 3 requirements will be added next; nothing has been submitted yet.</p>}{Object.keys(detailsErrors).length > 0 && <p className="mt-6 text-sm text-red-700">Please fix the highlighted fields to continue.</p>}<Footer onBack={() => { setAttempted(false); setStep(1); }} />
        </form>}
      </div>
    </main>
  );
}

function Footer({ onBack }: { onBack?: () => void }) { return <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">{onBack ? <button type="button" onClick={onBack} className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold hover:bg-slate-50">← Back</button> : <p className="text-xs text-slate-500">Step 1: tell us about your event.</p>}<button type="submit" className="rounded-xl bg-teal-800 px-8 py-3 text-sm font-semibold text-white transition hover:bg-teal-900">Next <span aria-hidden="true">→</span></button></div>; }
function PlannerDetails({ details, errors, update, toggle, inputClass, error }: DetailProps & { toggle: (service: string) => void }) { return <div className="space-y-6"><div><label htmlFor="plannerService" className="text-sm font-semibold">Primary planning need</label><select id="plannerService" name="plannerService" value={details.plannerService} onChange={(e) => update("plannerService", e.target.value)} className={inputClass(!!errors.plannerService)}><option value="">Select your main need</option>{plannerServices.map((service) => <option key={service}>{service}</option>)}</select>{error(errors.plannerService)}</div><div><label htmlFor="guestCount" className="text-sm font-semibold">Expected guests</label><input id="guestCount" name="guestCount" type="number" min="1" inputMode="numeric" value={details.guestCount} onChange={(e) => update("guestCount", e.target.value)} className={inputClass(!!errors.guestCount)} placeholder="e.g. 250" />{error(errors.guestCount)}</div><fieldset><legend className="text-sm font-semibold">Services needed</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{plannerServices.map((service) => <label key={service} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-300 p-4"><input type="checkbox" checked={details.plannerServices.includes(service)} onChange={() => toggle(service)} className="h-4 w-4 accent-teal-800" />{service}</label>)}</div>{error(errors.plannerServices)}</fieldset></div>; }
function PerformerDetails({ details, errors, update, inputClass, error }: DetailProps) { return <div className="grid gap-6 sm:grid-cols-2"><div><label htmlFor="performerType" className="text-sm font-semibold">Performer type</label><select id="performerType" name="performerType" value={details.performerType} onChange={(e) => update("performerType", e.target.value)} className={inputClass(!!errors.performerType)}><option value="">Select performer type</option>{performerTypes.map((type) => <option key={type}>{type}</option>)}</select>{error(errors.performerType)}</div><div><label htmlFor="performerStyle" className="text-sm font-semibold">Preferred genre or style</label><input id="performerStyle" name="performerStyle" value={details.performerStyle} maxLength={100} placeholder="e.g. Bollywood acoustic" onChange={(e) => update("performerStyle", e.target.value)} className={inputClass(!!errors.performerStyle)} />{error(errors.performerStyle)}</div></div>; }
function CrewDetails({ details, errors, update, inputClass, error }: DetailProps) { return <div className="grid gap-6 sm:grid-cols-2"><div><label htmlFor="crewRole" className="text-sm font-semibold">Crew role</label><select id="crewRole" name="crewRole" value={details.crewRole} onChange={(e) => update("crewRole", e.target.value)} className={inputClass(!!errors.crewRole)}><option value="">Select crew role</option>{crewRoles.map((role) => <option key={role}>{role}</option>)}</select>{error(errors.crewRole)}</div><div><label htmlFor="crewCount" className="text-sm font-semibold">People needed</label><input id="crewCount" name="crewCount" type="number" min="1" inputMode="numeric" value={details.crewCount} onChange={(e) => update("crewCount", e.target.value)} className={inputClass(!!errors.crewCount)} placeholder="e.g. 4" />{error(errors.crewCount)}</div></div>; }
type DetailProps = { details: CategoryDetails; errors: ReturnType<typeof validateCategoryDetails>; update: <K extends keyof CategoryDetails>(field: K, value: CategoryDetails[K]) => void; inputClass: (hasError: boolean) => string; error: (message?: string, id?: string) => React.ReactNode };
