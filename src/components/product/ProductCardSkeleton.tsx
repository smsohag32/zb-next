import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
    className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
    return (
        <div className={cn("group block w-full", className)}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                {/* Shimmer overlay is handled by shadcn Skeleton */}
                <Skeleton className="h-full w-full" />

                {/* Badge Placeholders */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <Skeleton className="h-5 w-12 rounded-full bg-white/20" />
                    <Skeleton className="h-5 w-12 rounded-full bg-white/20" />
                </div>

                {/* Wishlist Button Placeholder */}
                <Skeleton className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/20" />
            </div>

            {/* Info Section */}
            <div className="space-y-3 mt-4 px-1">
                {/* Brand */}
                <Skeleton className="h-3 w-1/3" />

                {/* Product Name */}
                <div className="space-y-1.5">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-2/3" />
                </div>

                {/* Price & Discount */}
                <div className="flex items-center gap-2 pt-1">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-5 w-16" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-3 w-3 rounded-full" />
                    ))}
                    <Skeleton className="ml-1 h-3 w-12" />
                </div>

                {/* Variant Indicators (Sizes/Colors) */}
                <div className="flex gap-1.5 pt-2">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-8 rounded-md" />
                    ))}
                </div>

                {/* Add to Cart Button Placeholder (Professional touch) */}
                <Skeleton className="h-11 w-full mt-4 rounded-xl" />
            </div>
        </div>
    );
}

// Support for grid convenience
export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
    return (
        <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6", className)}>
            {[...Array(count)].map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}
