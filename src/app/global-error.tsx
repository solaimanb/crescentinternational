"use client";

// global-error.tsx replaces the entire root layout when an unhandled error
// bubbles to the top of the React tree. Next.js requires this component to
// render its own <html> and <body> shells. See:
// https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errorjs
//
// `retry` (stable since Next.js 16.3) re-fetches server data before
// re-rendering, making recovery more reliable than the old `reset` which only
// cleared client state. `reset` is kept as a fallback type for older runtimes.
export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Something went wrong</title>
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "1.5rem",
          background: "#f8fafc",
          color: "#0f172a",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Something went wrong
        </h1>
        <p style={{ color: "#475569", marginBottom: "1.5rem", textAlign: "center" }}>
          We could not load this page. Please try again.
        </p>
        <button
          type="button"
          onClick={retry}
          style={{
            padding: "0.5rem 1.25rem",
            background: "#0f172a",
            color: "#fff",
            border: "none",
            borderRadius: "0.375rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
