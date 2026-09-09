export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">EventBridge</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Your next event starts here.</h1>
        <p className="mt-4 leading-7 text-slate-600">Post your requirements for event planners, performers, and crew.</p>
        <p className="mt-8 rounded-lg bg-teal-50 p-4 text-sm leading-6 text-teal-900">The project setup is ready. The requirement posting form is coming next.</p>
      </section>
    </main>
  );
}
