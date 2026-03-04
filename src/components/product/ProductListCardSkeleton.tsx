import { Skeleton } from "@/components/ui/skeleton";

export function ProductListCardSkeleton() {
    return (
        <div className="flex gap-4 rounded-2xl border bg-card p-4 overflow-hidden">
            {/* Product Image Skeleton */}
            <div className="relative shrink-0 overflow-hidden rounded-xl bg-secondary/30">
                <Skeleton className="h-32 w-32 sm:h-44 sm:w-44" />
            </div>

            {/* Product Details Skeleton */}
            <div className="flex flex-1 flex-col justify-between min-w-0 pr-2">
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        {/* Brand */}
                        <Skeleton className="h-3 w-20 bg-muted/60" />

                        {/* Name */}
                        <div className="space-y-1">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-2/3 hidden sm:block" />
                        </div>
                    </div>

                    {/* Description (desktop) */}
                    <div className="space-y-1.5 hidden lg:block">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-3 w-3 rounded-full" />
                        ))}
                    </div>
                </div>

                {/* Price and Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-auto pt-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-7 w-24" />
                        <Skeleton className="h-5 w-16" />
                    </div>

                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-10 w-32 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
