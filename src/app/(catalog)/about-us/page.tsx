import type { Metadata } from "next";
import { JsonLd } from "@/components/seo-json-ld";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold md:text-4xl">
            <h1>{aboutContent.title}</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line leading-7 text-muted-foreground">{aboutContent.body}</p>
        </CardContent>
      </Card>
    </div>
  );
}
