import { Skeleton } from "@/components/ui/skeleton";
import type { ViewMode } from "@/hooks/useViewMode";

export function SkeletonCard({ viewMode = "grid" }: { viewMode?: ViewMode }) {
  if (viewMode === "list") {
    return (
      <div className="flex bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md h-[180px]">
        <Skeleton className="w-[280px] shrink-0 rounded-none" />
        <div className="flex flex-col flex-1 px-5 py-4 gap-3">
          <Skeleton className="h-6 w-1/3 rounded-lg" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-1/3 rounded-md" />
          <div className="flex-1" />
          <Skeleton className="h-8 w-40 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden border-t-2 border-t-indigo-200 border border-gray-100 shadow-md">
      <div className="aspect-[16/10]">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-7 w-1/2 rounded-lg" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-3 w-1/3 rounded-md" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}
