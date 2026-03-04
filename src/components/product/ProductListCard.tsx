"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { cn } from "@/lib/utils";
import { cleanDescription, formatCurrency } from "@/lib/formatters";
import { getImageUrl } from "@/lib/getImage";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface ProductListCardProps {
   product: Product;
   index?: number;
}

export function ProductListCard({ product, index = 0 }: ProductListCardProps) {
   const router = useRouter();
   const { addItem } = useCartStore();
   const { toggleItem, isInWishlist } = useWishlistStore();
   const { toast } = useToast();
   const inWishlist = isInWishlist(product.id);

   const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const defaultSize =
         product.sizes.find((s) => (s.quantity || 0) > 0)?.name ||
         product.sizes.find((s) => (s.quantity || 0) > 0)?.size ||
         product.sizes[0]?.name ||
         product.sizes[0]?.size ||
         "";
      const defaultColor = product.colors?.[0]?.name || "";
      addItem(product, defaultSize, defaultColor);
      toast({ title: "Item added to cart", description: "Checkout your cart to complete your purchase." });
   };

   const handleToggleWishlist = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleItem(product);
      toast({
         title: inWishlist ? "Item removed from wishlist" : "Item added to wishlist",
         description: "Checkout your wishlist to view your items.",
      });
   };

   const handleBuyNow = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const defaultSize =
         product.sizes?.find((s) => (s.quantity || 0) > 0)?.name ||
         product.sizes?.find((s) => (s.quantity || 0) > 0)?.size ||
         product?.sizes?.[0]?.name ||
         product?.sizes?.[0]?.size ||
         "";
      const defaultColor = product?.colors?.[0]?.name || "";
      addItem(product, defaultSize, defaultColor);
      router.push("/checkout");
   };

   const discount = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.4, delay: index * 0.05 }}>
         <Link href={`/products/${product.slug}`} className="group block">
            <div className="flex gap-4 rounded-xl border bg-card p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
               {/* Product Image */}
               <div className="relative shrink-0 overflow-hidden rounded-lg bg-secondary/30">
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                     {product.isNew && (
                        <Badge className="bg-primary text-primary-foreground text-xs">New</Badge>
                     )}
                     {discount > 0 && (
                        <Badge variant="secondary" className="bg-foreground text-background text-xs">
                           -{discount}%
                        </Badge>
                     )}
                  </div>
                  <div className="h-32 w-32 sm:h-40 sm:w-40 overflow-hidden">
                     <Image
                        src={getImageUrl(product.images[0])}
                        alt={product.name}
                        width={160}
                        height={160}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized={getImageUrl(product.images[0]) === "/placeholder.svg"}
                     />
                  </div>
               </div>

               {/* Product Details */}
               <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div className="space-y-2">
                     <h3 className="font-semibold text-base sm:text-lg group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                     </h3>
                     <p className="text-sm text-muted-foreground line-clamp-3 hidden sm:block">
                        {cleanDescription(product.description || "", 150)}
                     </p>
                     <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                           {[...Array(5)].map((_, i) => (
                              <Star
                                 key={i}
                                 className={cn(
                                    "h-3.5 w-3.5",
                                    i < Math.floor(product.rating)
                                       ? "fill-primary text-primary"
                                       : "fill-muted text-muted"
                                 )}
                              />
                           ))}
                        </div>
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
                     </div>
                  </div>

                  {product.sizes && product.sizes.length > 0 && (
                     <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {product.sizes.map((size) => {
                           const isAvailable = (size.quantity || 0) > 0;
                           return (
                              <div
                                 key={size.name || size.size}
                                 className={cn(
                                    "flex items-center justify-center w-7 h-7 rounded-md border text-xs font-medium bg-background relative",
                                    isAvailable
                                       ? "border-border text-foreground"
                                       : "border text-muted-foreground line-through opacity-50 overflow-hidden"
                                 )}
                                 title={`${size.name || size.size} - ${size.quantity || 0} left`}>
                                 {size.name || size.size}
                              </div>
                           );
                        })}
                     </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                     <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary">{formatCurrency(product.price)}</span>
                        {product.originalPrice && (
                           <span className="text-sm text-muted-foreground line-through">
                              {formatCurrency(product.originalPrice)}
                           </span>
                        )}
                     </div>
                     <div className="flex items-center gap-2">
                        <Button
                           variant="outline"
                           size="icon"
                           className={cn("h-9 w-9 rounded-full shrink-0", inWishlist && "text-primary border-primary")}
                           onClick={handleToggleWishlist}>
                           <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
                        </Button>
                        <Button
                           size="sm"
                           className="gap-2"
                           onClick={handleAddToCart}
                           disabled={!product.inStock && !product.sizes?.some((s) => (s.quantity || 0) > 0)}>
                           <ShoppingBag className="h-4 w-4" />
                           <span className="hidden sm:inline">
                              {product.inStock || product.sizes?.some((s) => (s.quantity || 0) > 0) ? "Add to Cart" : "Out of Stock"}
                           </span>
                           <span className="sm:hidden">Add</span>
                        </Button>
                        <Button
                           size="sm"
                           className="gap-2 bg-black hover:bg-black/90 text-white"
                           onClick={handleBuyNow}
                           disabled={!product.inStock && !product.sizes?.some((s) => (s.quantity || 0) > 0)}>
                           <Zap className="h-4 w-4" />
                           <span className="hidden sm:inline">Buy Now</span>
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         </Link>
      </motion.div>
   );
}
