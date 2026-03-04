import { Loader2 } from "lucide-react";

interface ProductCardSkeletonProps {
   count?: number;
}

export const ProductCardSkeleton = ({ count = 4 }: ProductCardSkeletonProps) => {
   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {Array.from({ length: count }).map((_, idx) => (
            <div
               key={idx}
               className="border border-gray-200 rounded-lg overflow-hidden animate-pulse flex flex-col gap-3">
               {/* Image placeholder */}
               <div className="relative aspect-[3/4] bg-gray-200">
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                     <div className="bg-gray-300 h-5 w-12 rounded-full" />
                     <div className="bg-gray-300 h-5 w-12 rounded-full" />
                  </div>
                  {/* Wishlist / icon placeholder */}
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-gray-300" />
               </div>

               {/* Info */}
               <div className="p-3 flex flex-col gap-2 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/2" /> {/* brand */}
                  <div className="h-4 bg-gray-200 rounded w-full" /> {/* name */}
                  <div className="h-4 bg-gray-200 rounded w-3/4" /> {/* price */}
                  <div className="flex gap-1">
                     {/* rating stars */}
                     {Array.from({ length: 5 }).map((_, i) => (
                        <div
                           key={i}
                           className="h-3 w-3 bg-gray-300 rounded"
                        />
                     ))}
                  </div>
                  <div className="flex gap-1 pt-1">
                     {/* colors */}
                     {Array.from({ length: 4 }).map((_, i) => (
                        <div
                           key={i}
                           className="w-4 h-4 rounded-full bg-gray-300 border border-gray-200"
                        />
                     ))}
                  </div>
               </div>

               {/* Add to cart button placeholder */}
               <div className="h-10 bg-gray-300 rounded m-3 flex items-center justify-center">
                  <Loader2 className="animate-spin w-5 h-5 text-gray-400" />
               </div>
            </div>
         ))}
      </div>
   );
};
