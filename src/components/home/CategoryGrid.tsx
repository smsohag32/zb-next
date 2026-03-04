"use client";

import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

export function CategoryGrid() {
   const { categories, loading, error } = useSelector((state: RootState) => state.category);

   return (
      <section className="py-16 lg:py-24">
         <div className="container mx-auto px-4">
            {/* Header */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-center mb-12">
               <h2 className=" text-3xl lg:text-4xl font-bold">Shop by Category</h2>
               <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                  Browse our carefully curated collections
               </p>
            </motion.div>

            {/* Content */}
            {loading ? (
               <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                     <div
                        key={i}
                        className="rounded-lg overflow-hidden animate-pulse">
                        <Skeleton className="w-full aspect-[3/4] rounded-lg" />
                        <Skeleton className="mt-2 h-6 w-3/4 rounded" />
                        <Skeleton className="mt-1 h-4 w-1/2 rounded" />
                     </div>
                  ))}
               </div>
            ) : error ? (
               <div className="flex flex-col items-center justify-center py-16 text-center text-red-500">
                  <p className="text-lg font-medium">Failed to load categories.</p>
                  <p className="text-sm">Please try again later.</p>
               </div>
            ) : categories.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                  <p className="text-lg font-medium">No categories available.</p>
                  <p className="text-sm">Check back later for new collections.</p>
               </div>
            ) : (
               <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                  {categories.map((category, index) => (
                     <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}>
                        <Link
                           href={`/products?category=${category.slug}`}
                           className="group block relative rounded-lg overflow-hidden">
                           <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                              <img
                                 src={
                                    category.image
                                       ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace(
                                          /\/$/,
                                          ""
                                       )}/${category.image.replace(/^\/+/, "")}`
                                       : "/placeholder.svg"
                                 }
                                 alt={category.name + " Collections"}
                                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                           </div>

                           <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                              <h3 className="text-lg lg:text-xl font-semibold text-background dark:text-white/90">
                                 {category.name} Collections
                              </h3>
                              <p className="text-sm text-background/80 dark:text-white/80">
                                 {category.productCount} products
                              </p>
                           </div>
                        </Link>
                     </motion.div>
                  ))}
               </div>
            )}
         </div>
      </section>
   );
}
