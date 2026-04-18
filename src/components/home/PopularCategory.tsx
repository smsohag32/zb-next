"use client";

import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store";
import Link from "next/link";
import { CategoryCardSkeleton } from "../product/CategoryCardSkeleton";

export function PopularCategory() {
   const {
      categories,
      loading,
      error: sliceError,
   } = useSelector((state: RootState) => state.category);

   return (
      <section className="pt-10 pb-10 lg:py-16">
         <div className="container mx-auto px-4">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-center mb-12">
               <h2 className="text-2xl lg:text-3xl  font-medium mb-4">Popular Categories</h2>

            </motion.div>

            {loading ? (
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                     <CategoryCardSkeleton key={i} />
                  ))}
               </div>
            ) : sliceError ? (
               <div className="text-center text-destructive">
                  Failed to load categories. Please try again later.
               </div>
            ) : (
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {categories?.slice(0, 8).map((category, index) => (
                     <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}>
                        <Link
                           href={`/products?category=${category.slug}`}
                           className="group block relative rounded-sm overflow-hidden text-center md:text-left">
                           <div className="relative aspect-square w-full">
                              <img
                                 src={
                                    category?.image
                                       ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace(
                                          /\/$/,
                                          "",
                                       )}/${category.image.replace(/^\/+/, "")}`
                                       : "/placeholder.svg"
                                 }
                                 alt={`${category?.name} Collections`}
                                 width={400}
                                 height={400}
                                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />

                              <div
                                 className="absolute dark:from-black/60
                            inset-0 bg-gradient-to-t from-foreground/60 to-transparent"
                              />
                           </div>
                           <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                              <h3 className="text-lg lg:text-xl  font-semibold text-background dark:text-white/90">
                                 {category?.name + " " + "Collections"}
                              </h3>

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
