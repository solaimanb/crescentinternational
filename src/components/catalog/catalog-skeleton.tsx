import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
      <Skeleton className="h-8 w-48" />
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-64 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
