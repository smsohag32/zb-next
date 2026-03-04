import { ProductSkeleton } from "./ProductSkeleton";

interface ProductGridSkeletonProps {
    count?: number;
}

export function ProductGridSkeleton({ count = 8 }: ProductGridSkeletonProps) {
    return (
        <div className="container py-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(count)].map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
