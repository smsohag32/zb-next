"use client";

import Link from "next/link";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { useGetAllProductsQuery } from "@/redux-store/apis_action/products";
import { ProductCardSkeleton } from "../product/CardSkeleton";

export function NewArrivals() {
   const { data, isLoading, isError } = useGetAllProductsQuery({
      limit: 8,
      page: 0,
      sort: "newest",
   });

   const newArrivals = data?.data || [];

   return (
      <section className=" py-16 lg:py-24">
         <div className="container">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h2 className=" text-2xl font-medium lg:text-3xl">New Arrivals</h2>
                  <p className="mt-3 text-muted-foreground">Fresh styles just landed</p>
               </div>

               <Button
                  variant="ghost"
                  asChild
                  className="hidden sm:flex">
                  <Link href="/products?new=true">
                     View All
                     <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
               </Button>
            </div>

            {/* Content */}
            {isLoading ? (
               <ProductCardSkeleton count={8} />
            ) : isError ? (
               <div className="flex flex-col items-center justify-center py-16 text-center text-red-500">
                  <AlertCircle className="w-12 h-12 mb-4" />
                  <p className="text-lg font-medium">Failed to load products.</p>
                  <p className="text-sm">Please try refreshing the page.</p>
               </div>
            ) : newArrivals.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                  <AlertCircle className="w-12 h-12 mb-4" />
                  <p className="text-lg font-medium">No new arrivals yet.</p>
                  <p className="text-sm">Check back later for fresh styles.</p>
               </div>
            ) : (
               <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                  {newArrivals.map((product: any, index: any) => (
                     <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                     />
                  ))}
               </div>
            )}

            {/* Mobile view "View All" */}
            <div className="mt-8 text-center sm:hidden">
               <Button
                  variant="outline"
                  asChild>
                  <Link href="/products?new=true">
                     View All New
                     <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
               </Button>
            </div>
         </div>
      </section>
   );
}
