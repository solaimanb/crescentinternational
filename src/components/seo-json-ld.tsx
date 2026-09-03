import { safeJsonLdStringify } from "@/lib/content-safety";

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(data) }} />
  );
}
