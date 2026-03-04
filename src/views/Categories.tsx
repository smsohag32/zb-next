"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux-store";
import { CategoryCard } from "@/components/product/CategoryCard";
import { Seo } from "@/seo/Seo";


import { CategoryCardSkeleton } from "@/components/product/CategoryCardSkeleton";

export default function CategoriesPage() {
   // Get categories from Redux store
   const { categories, loading } = useSelector((state: RootState) => state.category);

   return (
      <div className="flex min-h-screen flex-col">
         <Seo storeData={{}} />
         <main className="flex-1 pb-16 lg:pb-0">
            <div className="container py-8">
               <h1 className=" text-2xl font-medium lg:text-3xl">Shop by Category</h1>
               <p className="mt-2 text-muted-foreground">
                  Explore our carefully curated collections
               </p>

               {/* Loading state */}
               {loading ? (
                  <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
                     {[...Array(8)].map((_, i) => (
                        <CategoryCardSkeleton key={i} />
                     ))}
                  </div>
               ) : (
                  <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
                     {categories && categories.length > 0 ? (
                        categories.map((category, index) => (
                           <CategoryCard
                              key={category.id}
                              category={category}
                              index={index}
                           />
                        ))
                     ) : (
                        <p className="col-span-full text-center text-muted-foreground">
                           No categories available.
                        </p>
                     )}
                  </div>
               )}
            </div>
         </main>
      </div>
   );
}
