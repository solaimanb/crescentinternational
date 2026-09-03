const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidSlug(value: string): boolean {
  return value.length <= 96 && slugPattern.test(value);
}

export function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isSafeCmsHref(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) {
    return true;
  }

  return isSafeHttpUrl(value);
}

export function isAllowedImageUrl(value: string): boolean {
  if (!isSafeHttpUrl(value)) {
    return false;
  }

  const hostname = new URL(value).hostname;
  return hostname === "images.pexels.com" || hostname.endsWith(".storage.c-5.us-east-2.aws.neon.tech");
}

export function safeJsonLdStringify(value: unknown): string {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (character) => {
    const escapes: Record<string, string> = {
      "<": "\\u003c",
      ">": "\\u003e",
      "&": "\\u0026",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029",
    };
    return escapes[character] ?? character;
  });
}
