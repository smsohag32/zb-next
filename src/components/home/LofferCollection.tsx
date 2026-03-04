"use client";

import Link from "next/link";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { useGetAllProductsQuery } from "@/redux-store/apis_action/products";
import { ProductGridSkeleton } from "@/components/product/ProductCardSkeleton";

export function LoaferCollection() {
   const { data, isLoading, isError } = useGetAllProductsQuery({
      limit: 8,
      page: 0,
      category: "loffers",
      sort: "newest",
   });

   const loafers = data?.data || [];

   return (
      <section className=" py-16 lg:py-24">
         <div className="container">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h2 className="text-2xl font-medium lg:text-3xl">Loafer Collection</h2>
                  <p className="mt-3 text-muted-foreground">Classic comfort with timeless style</p>
               </div>

               <Button
                  variant="ghost"
                  asChild
                  className="hidden sm:flex">
                  <Link href="/products?category=loafers">
                     View All
                     <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
               </Button>
            </div>

            {/* Content */}
            {isLoading ? (
               <ProductGridSkeleton count={8} />
            ) : isError ? (
               <div className="flex flex-col items-center justify-center py-16 text-center text-red-500">
                  <AlertCircle className="w-12 h-12 mb-4" />
                  <p className="text-lg font-medium">Failed to load loafers.</p>
                  <p className="text-sm">Please try refreshing the page.</p>
               </div>
            ) : loafers.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                  <AlertCircle className="w-12 h-12 mb-4" />
                  <p className="text-lg font-medium">No loafers available.</p>
                  <p className="text-sm">Check back later for new arrivals.</p>
               </div>
            ) : (
               <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                  {loafers.map((product: any, index: any) => (
                     <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                     />
                  ))}
               </div>
            )}

            {/* Mobile View */}
            <div className="mt-8 text-center sm:hidden">
               <Button
                  variant="outline"
                  asChild>
                  <Link href="/products?category=loafers">
                     View All Loafers
                     <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
               </Button>
            </div>
         </div>
      </section>
   );
}
