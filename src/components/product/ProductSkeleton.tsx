import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
    return (
        <div className="space-y-4">
            {/* Image & Badges */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                <Skeleton className="h-full w-full" />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <Skeleton className="h-5 w-10 rounded-full" />
                </div>
            </div>

            {/* Info */}
            <div className="space-y-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />

                <div className="flex items-center gap-2 pt-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-12" />
                </div>

                <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
        </div>
    );
}
