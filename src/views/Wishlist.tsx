"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { ProductGridSkeleton } from "@/components/product/ProductCardSkeleton";
import { useState, useEffect } from "react";

export default function WishlistPage() {
   const [isLoading, setIsLoading] = useState(true);
   const { items, clearWishlist } = useWishlistStore();
   const { addItem } = useCartStore();

   useEffect(() => {
      const timer = setTimeout(() => {
         setIsLoading(false);
      }, 600);
      return () => clearTimeout(timer);
   }, []);

   if (isLoading) {
      return (
         <div className="container py-8">
            <div className="space-y-4 mb-8">
               <div className="h-10 w-48 bg-muted animate-pulse rounded-md" />
               <div className="h-4 w-32 bg-muted animate-pulse rounded-md" />
            </div>
            <ProductGridSkeleton count={4} />
         </div>
      );
   }

   if (items.length === 0) {
      return (
         <div className="flex min-h-screen flex-col">
            <main className="flex-1 flex items-center justify-center pb-16 lg:pb-0">
               <div className="text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                     <span className="text-3xl">💝</span>
                  </div>
                  <h1 className="mt-4  text-2xl font-bold">Your wishlist is empty</h1>
                  <p className="mt-2 text-muted-foreground">Save items you love for later</p>
                  <Button
                     asChild
                     className="mt-6">
                     <Link href="/products">Start Shopping</Link>
                  </Button>
               </div>
            </main>
         </div>
      );
   }

   return (
      <div className="flex min-h-screen flex-col">
         <main className="flex-1 pb-16 lg:pb-0">
            <div className="container py-8">
               <div className="flex items-center justify-between">
                  <div>
                     <h1 className=" text-2xl font-medium lg:text-3xl">My Wishlist</h1>
                     <p className="mt-2 text-muted-foreground">{items.length} items saved</p>
                  </div>
                  <div className="flex gap-2">
                     <Button
                        variant="outline"
                        onClick={clearWishlist}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear All
                     </Button>
                  </div>
               </div>

               <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                  {items.map((product, index) => (
                     <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                     />
                  ))}
               </div>
            </div>
         </main>
      </div>
   );
}
