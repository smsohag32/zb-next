import type { Metadata } from "next";
import ProductDetailClient from "@/views/ProductDetail";

interface Props {
   params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const { slug } = await params;
   try {
      const res = await fetch(
         `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/product/public/by-slug/${slug}`,
         { next: { revalidate: 60 } },
      );
      if (!res.ok) return { title: "Product | ZBazar" };
      const data = await res.json();
      const product = data?.data;
      return {
         title: `${product?.name || "Product"} | ZBazar`,
         description:
            product?.description?.replace(/<[^>]+>/g, "").slice(0, 160) ||
            "Shop quality products at ZBazar",
         openGraph: {
            title: product?.name,
            description: product?.description?.replace(/<[^>]+>/g, "").slice(0, 160),
            images: product?.images?.[0]
               ? [{ url: `${process.env.NEXT_PUBLIC_BASE_URL}/${product.images[0]}` }]
               : [],
         },
      };
   } catch {
      return { title: "Product | ZBazar" };
   }
}

import { Suspense } from "react";
import { ProductDetailSkeleton } from "@/components/product/ProductDetailsSkeleton";

// Client component does all the interactive fetching
export default function ProductDetailPage() {
   return (
      <Suspense fallback={<ProductDetailSkeleton />}>
         <ProductDetailClient />
      </Suspense>
   );
}
