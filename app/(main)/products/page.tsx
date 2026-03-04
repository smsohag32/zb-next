import { Suspense } from "react";
import Products from "@/views/Products";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";

export default function ProductsPage() {
    return (
        <Suspense fallback={<ProductGridSkeleton />}>
            <Products />
        </Suspense>
    );
}
