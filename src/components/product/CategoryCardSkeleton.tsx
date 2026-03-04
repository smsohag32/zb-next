import { Skeleton } from "@/components/ui/skeleton";

export function CategoryCardSkeleton() {
    return (
        <div className="relative block overflow-hidden rounded-2xl aspect-square bg-muted">
            {/* Gradient overlay simulation */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                {/* Title Skeleton */}
                <Skeleton className="h-7 w-3/4 bg-white/20" />
                {/* Count Skeleton */}
                <Skeleton className="h-4 w-1/4 bg-white/20" />
            </div>
        </div>
    );
}
