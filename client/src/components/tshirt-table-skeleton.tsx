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

      {/* Desktop Grouped View Skeleton */}
      <div className="hidden md:block space-y-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="bg-muted/50 px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <Skeleton className="h-3 w-12" />
                    </th>
                    <th className="px-6 py-3 text-left">
                      <Skeleton className="h-3 w-16" />
                    </th>
                    <th className="px-6 py-3 text-right">
                      <Skeleton className="h-3 w-16 ml-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[...Array(3)].map((_, j) => (
                    <tr key={j}>
                      <td className="px-6 py-4">
                        <Skeleton className="h-5 w-8" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-5 w-12" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Skeleton className="h-9 w-9" />
                          <Skeleton className="h-9 w-9" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>

      {/* Mobile Grouped View Skeleton */}
      <div className="md:hidden space-y-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
            </div>
            <div className="divide-y">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
