import assert from "node:assert/strict";
import test from "node:test";
import {
  isAllowedImageUrl,
  isSafeCmsHref,
  isSafeHttpUrl,
  isValidSlug,
  safeJsonLdStringify,
  slugify,
} from "../src/lib/content-safety";

test("JSON-LD serialization cannot terminate its script element", () => {
  const serialized = safeJsonLdStringify({ title: "</script><script>alert(1)</script>" });

  assert.equal(serialized.includes("</script>"), false);
  assert.equal(JSON.parse(serialized).title, "</script><script>alert(1)</script>");
});

test("CMS links permit only internal paths and HTTPS URLs", () => {
  assert.equal(isSafeCmsHref("/all-products?category=hydraulic"), true);
  assert.equal(isSafeCmsHref("https://example.com/catalogue"), true);
  // HTTP is rejected — Next Image only allows https:// remotePatterns
  assert.equal(isSafeCmsHref("http://example.com/catalogue"), false);
  assert.equal(isSafeCmsHref("//evil.example"), false);
  assert.equal(isSafeCmsHref("javascript:alert(1)"), false);
  assert.equal(isSafeHttpUrl("mailto:sales@example.com"), false);
  assert.equal(isSafeHttpUrl("http://example.com"), false);
  assert.equal(isSafeHttpUrl("https://example.com"), true);
});

test("catalogue slug helpers create and validate stable URL slugs", () => {
  assert.equal(slugify("  Crème Mixer 500  "), "creme-mixer-500");
  assert.equal(isValidSlug("creme-mixer-500"), true);
  assert.equal(isValidSlug("Creme Mixer"), false);
  assert.equal(isValidSlug(""), false);
});

test("only configured image origins are accepted", () => {
  assert.equal(isAllowedImageUrl("https://images.pexels.com/photos/123/photo.jpeg"), true);
  assert.equal(isAllowedImageUrl("https://preview.storage.c-5.us-east-2.aws.neon.tech/c1-media/a.jpg"), true);
  assert.equal(isAllowedImageUrl("https://example.com/a.jpg"), false);
});
