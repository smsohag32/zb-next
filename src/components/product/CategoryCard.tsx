"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Category } from "@/types/category";
import { getImageUrl } from "@/lib/getImage";

interface CategoryCardProps {
   category: Category;
   index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
   return (
      <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.4, delay: index * 0.1 }}>
         <Link
            href={`/products/category/${category.slug}`}
            className="group relative block dark:bg-card overflow-hidden rounded-2xl">
            <div className="aspect-square  overflow-hidden">
               <img
                  src={getImageUrl(category.image)}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
            </div>
            <div
               className="absolute dark:from-black/80
                            inset-0 bg-gradient-to-t from-foreground/70 to-transparent"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6">
               <h3 className=" lg:text-2xl text-xl font-semibold dark:text-white/90 text-background">
                  {category.name} Collections
               </h3>
               <p className="mt-1 text-sm text-background/80 dark:text-white/80">
                  {category.productCount} products
               </p>
            </div>
         </Link>
      </motion.div>
   );
}
