import type { Metadata } from "next";
import { JsonLd } from "@/components/seo-json-ld";
import { getAboutContent } from "@/lib/content/site";
import { absoluteUrl, metaSnippet } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const aboutContent = await getAboutContent();
  return {
    title: aboutContent?.title,
    description: aboutContent ? metaSnippet(aboutContent.body) : undefined,
    alternates: { canonical: "/about-us" },
  };
}

export default async function AboutUsPage() {
  const aboutContent = await getAboutContent();

  if (!aboutContent) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: aboutContent.title,
          description: metaSnippet(aboutContent.body),
          url: absoluteUrl("/about-us"),
        }}
      />
      <section className="rounded-xs border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{aboutContent.title}</h1>
        <p className="mt-4 whitespace-pre-line leading-7 text-slate-700">{aboutContent.body}</p>
      </section>
    </div>
  );
}
