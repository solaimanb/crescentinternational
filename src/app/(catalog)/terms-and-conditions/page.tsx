import type { Metadata } from "next";
import { JsonLd } from "@/components/seo-json-ld";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold md:text-4xl">
            <h1>{termsContent.title}</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line leading-7 text-muted-foreground">{termsContent.body}</p>
        </CardContent>
      </Card>
    </div>
  );
}
