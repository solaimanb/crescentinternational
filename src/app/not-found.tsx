import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex-1">
      <Empty className="mx-auto min-h-[40vh] w-full max-w-3xl px-4 py-16">
        <EmptyHeader>
          <EmptyTitle className="text-3xl">
            <h1>Page not found</h1>
          </EmptyTitle>
          <EmptyDescription>The page you requested does not exist.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button nativeButton={false} render={<Link href="/" />}>
            Back to Home
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  );
}
