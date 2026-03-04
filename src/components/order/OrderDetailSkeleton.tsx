import { motion } from "framer-motion";

export default function OrderDetailSkeleton() {
   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="space-y-6 max-w-4xl mx-auto py-12 lg:py-16">
         {/* Header */}
         <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
               <div className="h-5 w-1/3 bg-muted animate-pulse rounded" />
               <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-6 w-24 bg-muted animate-pulse rounded" />
         </div>

         {/* Order Progress */}
         <div className="bg-card rounded-lg p-6 space-y-4">
            <div className="h-6 w-1/4 bg-muted animate-pulse rounded" />
            <div className="flex justify-between mt-4">
               {[...Array(4)].map((_, i) => (
                  <div
                     key={i}
                     className="flex flex-col items-center space-y-2">
                     <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                     <div className="h-3 w-12 bg-muted animate-pulse rounded" />
                  </div>
               ))}
            </div>
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded mt-6" />
         </div>

         {/* Order Items */}
         <div className="bg-card rounded-lg p-6 space-y-4">
            <div className="h-6 w-1/4 bg-muted animate-pulse rounded mb-4" />
            {[...Array(3)].map((_, i) => (
               <div
                  key={i}
                  className="flex gap-4 items-center">
                  <div className="w-20 h-24 bg-muted animate-pulse rounded-md shrink-0" />
                  <div className="flex-1 space-y-2">
                     <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                     <div className="h-3 w-1/4 bg-muted animate-pulse rounded" />
                     <div className="h-3 w-1/3 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
               </div>
            ))}
         </div>

         {/* Shipping & Payment */}
         <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-6 space-y-4">
               <div className="h-5 w-1/4 bg-muted animate-pulse rounded" />
               <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                     <div
                        key={i}
                        className="h-3 w-full bg-muted animate-pulse rounded"
                     />
                  ))}
               </div>
            </div>

            <div className="bg-card rounded-lg p-6 space-y-4">
               <div className="h-5 w-1/3 bg-muted animate-pulse rounded" />
               <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                     <div
                        key={i}
                        className="h-3 w-full bg-muted animate-pulse rounded"
                     />
                  ))}
               </div>
               <div className="h-6 w-1/3 bg-muted animate-pulse rounded mt-4" />
            </div>
         </div>

         {/* Actions */}
         <div className="flex flex-wrap gap-4 mt-4">
            {[...Array(3)].map((_, i) => (
               <div
                  key={i}
                  className="h-10 w-32 bg-muted animate-pulse rounded"
               />
            ))}
         </div>
      </motion.div>
   );
}
