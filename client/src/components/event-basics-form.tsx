"use client";

import { useState, type FormEvent } from "react";
import { categories, eventTypes, initialBasics, validateBasics, type EventBasics } from "@/lib/event-basics";

const steps = ["Event basics", "Category details", "Requirements", "Review & submit"];

export default function EventBasicsForm() {
  const [values, setValues] = useState<EventBasics>(initialBasics);
  const [attempted, setAttempted] = useState(false);
  const [complete, setComplete] = useState(false);
  const errors = attempted ? validateBasics(values) : {};

  function update<K extends keyof EventBasics>(field: K, value: EventBasics[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setComplete(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    const nextErrors = validateBasics(values);
    const firstField = Object.keys(nextErrors)[0];
    if (firstField) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus();
      setComplete(false);
      return;
    }
    setComplete(true);
  }

  function fieldProps(field: keyof EventBasics) {
    return {
      id: field,
      name: field,
      value: values[field],
      "aria-invalid": !!errors[field],
      "aria-describedby": errors[field] ? `${field}-error` : undefined,
      className: `mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 ${errors[field] ? "border-red-500" : "border-slate-300"}`,
    };
  }

  function error(field: keyof EventBasics) {
    return errors[field] ? <p id={`${field}-error`} className="mt-2 text-sm text-red-700">{errors[field]}</p> : null;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-800 font-bold text-white">E</span>
          <span className="text-xl font-bold tracking-tight">EventBridge</span>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-widest text-teal-700">Post a requirement</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Let’s bring your event to life.</h1>
        <p className="mt-3 text-slate-600">Start with the basics. Tell us what you’re planning and who you need.</p>

        <nav aria-label="Form progress" className="my-8">
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step} aria-current={index === 0 ? "step" : undefined} className={`flex items-center gap-2 rounded-xl px-3 py-3 text-sm ${index === 0 ? "bg-teal-100 font-semibold text-teal-900" : "text-slate-500"}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${index === 0 ? "bg-teal-800 text-white" : "border border-slate-300 bg-white"}`}>{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </nav>

        <form noValidate onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7 border-b border-slate-100 pb-6">
            <p className="text-sm font-medium text-teal-700">Step 1 of 4</p>
            <h2 className="mt-1 text-2xl font-semibold">Event basics</h2>
            <p className="mt-2 text-sm text-slate-500">All fields are required unless marked optional.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="eventName" className="text-sm font-semibold">Event name</label>
              <input {...fieldProps("eventName")} required maxLength={150} placeholder="e.g. Annual College Fest" onChange={(e) => update("eventName", e.target.value)} />
              {error("eventName")}
            </div>
            <div>
              <label htmlFor="eventType" className="text-sm font-semibold">Event type</label>
              <select {...fieldProps("eventType")} required onChange={(e) => update("eventType", e.target.value)}>
                <option value="">Select event type</option>
                {eventTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              {error("eventType")}
            </div>
            <div>
              <label htmlFor="startDate" className="text-sm font-semibold">Start date</label>
              <input {...fieldProps("startDate")} required type="date" onChange={(e) => update("startDate", e.target.value)} />
              {error("startDate")}
            </div>
            <div>
              <label htmlFor="endDate" className="text-sm font-semibold">End date <span className="font-normal text-slate-500">(optional)</span></label>
              <input {...fieldProps("endDate")} type="date" min={values.startDate || undefined} onChange={(e) => update("endDate", e.target.value)} />
              <p className="mt-2 text-xs text-slate-500">Leave blank for a single-day event.</p>
              {error("endDate")}
            </div>
            <div>
              <label htmlFor="location" className="text-sm font-semibold">Location</label>
              <input {...fieldProps("location")} required maxLength={300} placeholder="City or event address" onChange={(e) => update("location", e.target.value)} />
              {error("location")}
            </div>
            <div>
              <label htmlFor="venue" className="text-sm font-semibold">Venue <span className="font-normal text-slate-500">(optional)</span></label>
              <input {...fieldProps("venue")} maxLength={200} placeholder="e.g. City Convention Centre" onChange={(e) => update("venue", e.target.value)} />
            </div>
          </div>

          <fieldset className="mt-8" aria-describedby={errors.category ? "category-error" : undefined}>
            <legend className="text-sm font-semibold">Who are you looking for?</legend>
            <p className="mt-1 text-sm text-slate-500">Choose one category for this requirement.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {categories.map((category) => (
                <label key={category.value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition focus-within:ring-2 focus-within:ring-teal-700 ${values.category === category.value ? "border-teal-700 bg-teal-50" : "border-slate-300 hover:bg-slate-50"}`}>
                  <input type="radio" name="category" required value={category.value} checked={values.category === category.value} onChange={() => update("category", category.value)} aria-describedby={errors.category ? "category-error" : undefined} className="mt-1 h-4 w-4 shrink-0 accent-teal-800" />
                  <span><span className="block text-sm font-semibold">{category.label}</span><span className="mt-1 block text-xs leading-5 text-slate-600">{category.description}</span></span>
                </label>
              ))}
            </div>
            {error("category")}
          </fieldset>

          <div aria-live="polite">
            {complete && <p className="mt-6 rounded-xl bg-teal-50 p-4 text-sm leading-6 text-teal-900">Event basics are complete. Your details are kept here while this page stays open. Category details are coming next; nothing has been submitted yet.</p>}
            {Object.keys(errors).length > 0 && <p className="mt-6 text-sm text-red-700">Please fix the highlighted fields to continue.</p>}
          </div>
          <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">Step 1: tell us about your event.</p>
            <button type="submit" className="rounded-xl bg-teal-800 px-8 py-3 text-sm font-semibold text-white transition hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">Next <span aria-hidden="true">→</span></button>
          </div>
        </form>
      </div>
    </main>
  );
}
