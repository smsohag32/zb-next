"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Plus, ShoppingBag, ShoppingCart, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImage";
import { formatCurrency } from "@/lib/formatters";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface ProductCardProps {
   product: Product;
   index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
   const router = useRouter();
   const { addItem } = useCartStore();
   const { toggleItem, isInWishlist } = useWishlistStore();
   const inWishlist = isInWishlist(product.id);
   const { toast } = useToast();

   const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const defaultSize =
         product.sizes?.find((s) => (s.quantity || 0) > 0)?.name ||
         product.sizes?.find((s) => (s.quantity || 0) > 0)?.size ||
         product?.sizes?.[0]?.name ||
         product?.sizes?.[0]?.size ||
         "";
      const defaultColor = product?.colors?.[0]?.color || product?.colors?.[0]?.name || "";
      addItem(product, defaultSize, defaultColor);
      toast({
         title: "Item added to cart",
         description: "Checkout your cart to complete your purchase.",
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
      const defaultColor = product?.colors?.[0]?.color || product?.colors?.[0]?.name || "";

      // Store buyNow item in sessionStorage for the checkout page to pick up
      if (typeof window !== "undefined") {
         sessionStorage.setItem(
            "buyNowItem",
            JSON.stringify({
               product,
               selectedSize: defaultSize,
               selectedColor: defaultColor,
               quantity: 1,
            }),
         );
      }
      router.push("/checkout");
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

   const discount = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.4, delay: index * 0.1 }}>
         <Link
            href={`/products/${product.slug}`}
            className="group block">
            <div className="relative lg:aspect-[4/4] overflow-hidden bg-muted">
               {/* Badges */}
               <div className="absolute top-2 left-0  z-10 flex flex-col gap-2">
                  {product.isNew && (
                     <Badge className="bg-primary rounded-e-full text-primary-foreground ">New</Badge>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                     <Badge
                        variant="secondary"
                        className="bg-red-600 hover:bg-red-700 rounded-e-full text-white rounded-s-none">
                        Save {product.originalPrice - product.price} ৳
                     </Badge>
                  )}
               </div>

               {/* Wishlist */}
               <Button
                  variant="secondary"
                  size="icon"
                  className={cn(
                     "absolute top-1 right-2 z-10 h-8 w-8 transition-all duration-300",
                     "lg:opacity-0 lg:group-hover:opacity-100",
                     inWishlist ? "opacity-100 text-primary" : "bg-background/80 backdrop-blur-sm",
                  )}
                  onClick={handleToggleWishlist}>
                  <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
               </Button>

               {/* Image */}
               <div className="lg:aspect-[4/4] border rounded-none border-gray-100 aspect-[4/4] overflow-hidden">
                  <Image
                     src={getImageUrl(product.images[0])}
                     alt={product.name}
                     width={400}
                     height={400}
                     className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                     unoptimized={getImageUrl(product.images[0]) === "/placeholder.svg"}
                  />
               </div>

               {/* Quick Add - Desktop */}
               <div className="absolute lg:bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden lg:block">
                  <div className="flex gap-2">
                     <Button
                        variant="outline"
                        className="flex-1  border-primary text-primary hover:bg-white/50 hover:text-primary"
                        onClick={handleAddToCart}
                        disabled={
                           !product.inStock && !product.sizes?.some((s) => (s.quantity || 0) > 0)
                        }>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        {product.inStock || product.sizes?.some((s) => (s.quantity || 0) > 0)
                           ? "Add to Cart"
                           : "Out of Stock"}
                     </Button>
                     <Button
                        className="flex-1  bg-black/80 hover:bg-black/90"
                        onClick={handleBuyNow}
                        disabled={
                           !product.inStock && !product.sizes?.some((s) => (s.quantity || 0) > 0)
                        }>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Buy Now
                     </Button>
                  </div>
               </div>
            </div>

            {/* Mobile quick-add */}
            <div className="bottom-2 left-2 mt-2 right-2 flex gap-2 lg:hidden">
               <Button
                  variant="outline"
                  size="icon"
                  aria-label="Add to cart"
                  className=" w-auto h-9 shrink-0 rounded-none w-9"
                  onClick={handleAddToCart}
                  disabled={!product.inStock && !product.sizes?.some((s) => (s.quantity || 0) > 0)}>
                  <Plus className="h-4  w-4" />
               </Button>
               <Button
                  size="sm"
                  variant={"default"}
                  className=" flex-1  h-9 flex-1 gap-2 bg-zinc-900 !text-white hover:bg-zinc-800  rounded-none  active:scale-95 transition-all border-none "
                  onClick={handleBuyNow}
                  disabled={!product.inStock && !product.sizes?.some((s) => (s.quantity || 0) > 0)}>
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-xs font-bold whitespace-nowrap">Buy Now</span>
               </Button>
            </div>

            {/* Info */}
            <div className="space-y-1 mt-4 lg:mt-3 px-1">
               <h3 className="font-medium text-sm lg:text-base line-clamp-2  transition-colors leading-tight min-h-[1.5rem] lg:min-h-0">
                  {product.name}
               </h3>
               <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 lg:pt-1">
                  <span className="font-bold text-base lg:text-lg text-primary">
                     {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && (
                     <span className="text-xs lg:text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                        {formatCurrency(product.originalPrice)}
                     </span>
                  )}
               </div>

               {/* Rating */}
               <div className="flex items-center gap-1.5 py-0.5">
                  <div className="flex items-center">
                     {[...Array(5)].map((_, i) => (
                        <Star
                           key={i}
                           className={cn(
                              "h-3 w-3",
                              i < Math.floor(product.rating)
                                 ? "fill-yellow-400 text-yellow-400"
                                 : "text-muted stroke-muted-foreground/30",
                           )}
                        />
                     ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">
                     ({product.reviewCount})
                  </span>
               </div>

               {/* Sizes */}
               {product.sizes && product.sizes.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                     {product.sizes?.map((size) => (
                        <div
                           key={size.name || size.size}
                           className={cn(
                              "flex items-center justify-center min-w-[32px] h-7 px-1.5 border text-[10px] font-semibold bg-background transition-colors",
                              (size.quantity || 0) > 0
                                 ? "border-border text-foreground hover:border-primary hover:text-primary cursor-default"
                                 : "border-dashed opacity-40 grayscale pointer-events-none relative overflow-hidden",
                           )}
                           title={`${size.name || size.size} - ${size.quantity || 0} left`}>
                           {size.name || size.size}
                           {(size.quantity || 0) <= 0 && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="w-[120%] h-[1px] bg-muted-foreground/50 rotate-45" />
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </Link>
      </motion.div>
   );
}
