import type { Metadata } from "next";
import { JsonLd } from "@/components/seo-json-ld";
import { getTermsContent } from "@/lib/content/site";
import { absoluteUrl, metaSnippet } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const termsContent = await getTermsContent();
  return {
    title: termsContent?.title,
    description: termsContent ? metaSnippet(termsContent.body) : undefined,
    alternates: { canonical: "/terms-and-conditions" },
  };
}

export default async function TermsAndConditionsPage() {
  const termsContent = await getTermsContent();

  if (!termsContent) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: termsContent.title,
          description: metaSnippet(termsContent.body),
          url: absoluteUrl("/terms-and-conditions"),
        }}
      />
      <section className="rounded-xs border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{termsContent.title}</h1>
        <p className="mt-4 whitespace-pre-line leading-7 text-slate-700">{termsContent.body}</p>
      </section>
    </div>
  );
}
