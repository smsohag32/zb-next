import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
   return (
      <div className="flex min-h-screen flex-col bg-white">
         <main className="flex-1 pb-16 lg:pb-0">
            <div className="container py-6">
               {/* Breadcrumbs Skeleton */}
               <nav className="mb-6 flex flex-wrap items-center gap-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
               </nav>

               <div className="grid gap-8 lg:grid-cols-2">
                  {/* Image Gallery Skeleton */}
                  <div className="space-y-4">
                     {/* Main Image */}
                     <Skeleton className="aspect-square w-full rounded-xl" />
                     {/* Thumbnails */}
                     <div className="flex flex-wrap gap-2 lg:grid lg:grid-cols-6 lg:gap-4">
                        {[...Array(6)].map((_, i) => (
                           <Skeleton key={i} className="aspect-square w-[calc(25%-8px)] lg:w-full rounded-md" />
                        ))}
                     </div>
                  </div>

                  {/* Product Info Skeleton */}
                  <div className="space-y-6">
                     <div className="space-y-3">
                        {/* Title */}
                        <Skeleton className="h-10 w-3/4" />
                        {/* Rating Row */}
                        <div className="flex items-center gap-3">
                           <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                 <Skeleton key={i} className="h-4 w-4 rounded-full" />
                              ))}
                           </div>
                           <Skeleton className="h-4 w-24" />
                        </div>
                     </div>

                     {/* Price Row */}
                     <div className="flex items-baseline gap-3">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                     </div>

                     {/* Description Skeletons */}
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                     </div>

                     <Skeleton className="h-px w-full" />

                     {/* Variants - Color */}
                     <div className="space-y-3">
                        <Skeleton className="h-4 w-32" />
                        <div className="flex flex-wrap gap-3">
                           {[...Array(4)].map((_, i) => (
                              <Skeleton key={i} className="h-10 w-10 rounded-full" />
                           ))}
                        </div>
                     </div>

                     {/* Variants - Size */}
                     <div className="space-y-3">
                        <div className="flex items-center justify-between">
                           <Skeleton className="h-4 w-32" />
                           <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {[...Array(5)].map((_, i) => (
                              <Skeleton key={i} className="h-9 w-12 rounded-md" />
                           ))}
                        </div>
                     </div>

                     {/* Quantity Selector */}
                     <div className="space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-32 rounded-md" />
                     </div>

                     {/* Main Actions */}
                     <div className="flex flex-wrap gap-3">
                        <Skeleton className="h-12 flex-1 min-w-[140px] rounded-md" />
                        <div className="flex gap-3">
                           <Skeleton className="h-12 w-12 rounded-md" />
                           <Skeleton className="h-12 w-12 rounded-md" />
                        </div>
                     </div>

                     {/* Secondary Action */}
                     <Skeleton className="h-12 w-full rounded-md" />

                     {/* Accordion Skeleton */}
                     <div className="pt-4">
                        <Skeleton className="h-12 w-full rounded-t-md" />
                        <Skeleton className="h-px w-full" />
                     </div>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
}
