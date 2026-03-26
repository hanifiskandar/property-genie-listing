import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <div className="aspect-[16/10]">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-1/2 rounded-lg" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-3 w-1/3 rounded-md" />
        <div className="border-t border-gray-100 pt-3 flex gap-4">
          <Skeleton className="h-3 w-10 rounded-md" />
          <Skeleton className="h-3 w-10 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}
