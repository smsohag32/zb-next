"use client";

import { Suspense } from "react";
import CategoryPage from "@/views/CategoryPage";
import { ProductGridSkeleton } from "@/components/product/ProductCardSkeleton";

export default function CategoryPageWrapper() {
    return (
        <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <CategoryPage />
        </Suspense>
    );
}
