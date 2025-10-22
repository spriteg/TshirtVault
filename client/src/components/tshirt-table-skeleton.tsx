import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TshirtTableSkeleton() {
  return (
    <>
      {/* Search and Filters Skeleton */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1 sm:max-w-sm" />
          <Skeleton className="h-10 w-full sm:w-48" />
        </div>
      </div>

      {/* Color Groups Skeleton */}
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex flex-col gap-4">
              {/* Desktop Layout */}
              <div className="hidden md:flex md:items-start md:gap-6">
                <div className="min-w-[120px]">
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex-1 flex flex-wrap gap-4">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-12 w-48" />
                  ))}
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden">
                <div className="flex items-center gap-2 mb-3">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-8 rounded-full" />
                </div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-14 w-full" />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
