import type { Metadata } from "next";
import { JsonLd } from "@/components/seo-json-ld";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getContactContent } from "@/lib/content/site";
import { absoluteUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const contactContent = await getContactContent();
  return {
    title: contactContent?.title,
    description: contactContent?.intro,
    alternates: { canonical: "/contact-us" },
  };
}

export default async function ContactPage() {
  const contactContent = await getContactContent();

  if (!contactContent) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: contactContent.title,
          description: contactContent.intro,
          url: absoluteUrl("/contact-us"),
        }}
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold md:text-4xl">
            <h1>{contactContent.title}</h1>
          </CardTitle>
          <CardDescription className="text-base text-foreground">{contactContent.intro}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card size="sm" className="bg-muted/50 py-4">
              <CardHeader className="px-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{contactContent.phoneLabel}</p>
                <p className="text-base font-semibold">{contactContent.phoneValue}</p>
              </CardHeader>
            </Card>
            <Card size="sm" className="bg-muted/50 py-4">
              <CardHeader className="px-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{contactContent.emailLabel}</p>
                <p className="text-base font-semibold">{contactContent.emailValue}</p>
              </CardHeader>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
