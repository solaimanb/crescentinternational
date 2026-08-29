import type { Metadata } from "next";
import { getContactContent } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const contactContent = await getContactContent();

  if (!contactContent) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{contactContent.title}</h1>
        <p className="mt-3 text-slate-700">{contactContent.intro}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{contactContent.phoneLabel}</p>
            <p className="mt-1 text-base font-semibold text-slate-900">{contactContent.phoneValue}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{contactContent.emailLabel}</p>
            <p className="mt-1 text-base font-semibold text-slate-900">{contactContent.emailValue}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
