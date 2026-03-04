"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
   ChevronLeft,
   Heart,
   Star,
   Truck,
   RotateCcw,
   Shield,
   Minus,
   Plus,
   ShoppingBag,
   Loader2,
   ShoppingCart,
   X,
   Share2,
   User,
} from "lucide-react";
import { motion } from "framer-motion";

import { Footer } from "@/components/layout/Footer";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { cn } from "@/lib/utils";
import {
   useGetProductBySlugQuery,
   useGetRelatedProductsQuery,
} from "@/redux-store/apis_action/products";
import { useGetProductReviewsQuery, useAddReviewMutation } from "@/redux-store/apis_action/review";
import { ProductGrid } from "@/components/product/ProductGrid";
import { capitalizeWords, cleanDescription, formatCurrency, formatDate } from "@/lib/formatters";
import { ProductDetailSkeleton } from "@/components/product/ProductDetailsSkeleton";
import { ProductImageZoom } from "@/components/product/ProductImageZoom";
import { ShareButton } from "@/components/product/ShareButton";
import { getImageUrl } from "@/lib/getImage";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import NotFound from "./NotFound";
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

import { RichTextViewer } from "@/components/RichTextViewer";
import { RichTextSeeMoreViewer } from "@/components/RichTextSeeMoreViewer";
import { trackViewItem, trackAddToCart } from "@/lib/analytics";
import { Seo } from "@/seo/Seo";

export default function ProductDetailPage() {
   const params = useParams();
   const slug = params?.slug as string;
   const { addItem } = useCartStore();
   const { toggleItem, isInWishlist } = useWishlistStore();
   const isMobile = useIsMobile();
   const router = useRouter();
   const pathname = usePathname();
   const [selectedImage, setSelectedImage] = useState(0);
   const [selectedSize, setSelectedSize] = useState<string>("");
   const [selectedColor, setSelectedColor] = useState<string>("");
   const [quantity, setQuantity] = useState(1);
   const { data, isError, isLoading } = useGetProductBySlugQuery(slug);

   useEffect(() => {
      if (data?.id) {
         trackViewItem(data);

         // Auto-select first available size
         if (data.sizes?.length > 0) {
            const firstAvailableSize = data.sizes.find((s: any) => s.quantity > 0);
            if (firstAvailableSize) {
               setSelectedSize(firstAvailableSize.size);
            }
         }

         // Auto-select first color
         if (data.colors?.length > 0) {
            setSelectedColor(data.colors[0].color);
         }
      }
   }, [data?.id]);
   const { toast } = useToast();
   const product = data || {};
   const { user } = useSelector((state: any) => state.auth);

   // Reviews
   const { data: reviewsData, isLoading: reviewsLoading } = useGetProductReviewsQuery(product?.id, {
      skip: !product?.id,
   });
   const [addReview, { isLoading: isAddingReview }] = useAddReviewMutation();

   const [newReviewRating, setNewReviewRating] = useState(0);
   const [newReviewComment, setNewReviewComment] = useState("");

   const {
      data: productData,
      isError: productError,
      isLoading: productLoading,
   } = useGetRelatedProductsQuery(product?.id, { skip: !data?.category?.toLowerCase() });

   if (isLoading) {
      return <ProductDetailSkeleton />;
   }

   const isWishlisted = isInWishlist(product.id);

   if (!product || isError) {
      return (
         <div className="flex min-h-screen flex-col">
            <main className="flex-1 flex items-center justify-center">
               <div className="text-center">
                  <h1 className="text-2xl font-bold">Product not found</h1>
                  <Button asChild className="mt-4">
                     <Link href="/products">Back to Shop</Link>
                  </Button>
               </div>
            </main>
            <Footer />
         </div>
      );
   }

   const inWishlist = isInWishlist(product.id);
   const discount = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

   // Selected size object for stock check
   const selectedSizeObj = selectedSize
      ? product?.sizes?.find((s: any) => s.size === selectedSize)
      : null;

   // Determine if the product can be added to cart
   const canAddToCart = (() => {
      const hasSizes = product.sizes?.length > 0;
      const hasColors = product.colors?.length > 0;

      // Case: product has both sizes and colors
      if (hasSizes && hasColors) {
         return !!selectedSizeObj && selectedColor && selectedSizeObj.quantity > 0;
      }

      // Case: product has only sizes
      if (hasSizes && !hasColors) {
         return !!selectedSizeObj && selectedSizeObj.quantity > 0;
      }

      // Case: product has only colors
      if (!hasSizes && hasColors) {
         return !!selectedColor;
      }

      // Case: product has neither sizes nor colors
      return true;
   })();

   const handleAddToCart = () => {
      if (!canAddToCart) {
         toast({
            title: "Select options",
            description: "Please select the required size and/or color before adding to cart.",
            variant: "destructive",
         });
         return;
      }

      addItem(product, selectedSize, selectedColor, quantity);
      trackAddToCart(product, quantity, selectedSize, selectedColor);
      toast({
         title: "Item added to cart",
         description: "Checkout your cart to complete your purchase.",
      });
   };

   const handleBuyNow = () => {
      if (!canAddToCart) {
         toast({
            title: "Select options",
            description: "Please select the required size and/or color before buying.",
            variant: "destructive",
         });
         return;
      }
      trackAddToCart(product, quantity, selectedSize, selectedColor);
      // Store buyNow item in sessionStorage for Next.js (no router state)
      if (typeof window !== "undefined") {
         sessionStorage.setItem("buyNowItem", JSON.stringify({ product, selectedSize, selectedColor, quantity }));
      }
      router.push("/checkout");
   };

   const handleSubmitReview = async () => {
      if (newReviewRating === 0) {
         toast({
            title: "Rate the product",
            description: "Please select a star rating",
            variant: "destructive",
         });
         return;
      }
      if (!newReviewComment.trim()) {
         toast({
            title: "Write a comment",
            description: "Please write a review comment",
            variant: "destructive",
         });
         return;
      }

      try {
         const res = await addReview({
            productId: product.id,
            rating: newReviewRating,
            comment: newReviewComment,
         }).unwrap();

         if (res.status) {
            toast({ title: "Review submitted", description: "Thank you for your feedback!" });
            setNewReviewRating(0);
            setNewReviewComment("");
         }
      } catch (err: any) {
         toast({
            title: "Error",
            description: err?.data?.message || "Failed to submit review",
            variant: "destructive",
         });
      }
   };

   const relatedProducts = productData?.data;
   const reviews = reviewsData?.data || [];

   const seoData = {
      metaTitle: `${capitalizeWords(product.name)} | ${capitalizeWords(product.category?.name || "Z Bazar BD")}`,
      metaDescription: cleanDescription(
         product.description ||
         `Buy ${product.name} at best price. Fast delivery and secure checkout.`,
      ).substring(0, 160),
      metaTags: [
         product.name, product.brand, "Z Bazar BD", "Zbazar",
         typeof product.category === 'object' ? product.category?.name : product.category,
         typeof product.subcategory === 'object' ? product.subcategory?.name : product.subcategory
      ].filter(Boolean),
   };

   if (productError)
      <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive flex items-center gap-3">
         <X className="w-5 h-5" />
         <span className="font-medium">Something went wrong. Please try again.</span>
      </div>;
   return (
      <div className="flex min-h-screen flex-col">
         <Seo storeData={seoData} />
         <main className="flex-1 pb-16 lg:pb-0">
            <div className="container py-6">
               <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <Link href="/" className="hover:text-foreground">Home</Link>
                  <span>/</span>
                  <Link href="/products" className="hover:text-foreground">Shop</Link>
                  <span>/</span>
                  <Link href={`/products?category=${typeof product.category === 'object' ? product.category?.slug : product.category}`} className="hover:text-foreground capitalize">
                     {typeof product.category === 'object' ? product.category?.name : product.category}
                  </Link>
                  <span>/</span>
                  <span className="text-foreground">{product.name}</span>
               </nav>
               <div className="grid gap-8 h-auto lg:grid-cols-2">
                  {/* Image Gallery */}
                  <motion.div
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="space-y-4">
                     <ProductImageZoom
                        src={getImageUrl(product?.images[selectedImage])}
                        alt={product.name}
                     />
                     {product?.images?.length > 1 && (
                        <div
                           className={cn(
                              "flex gap-3 overflow-x-auto pb-2 scrollbar-hide lg:grid lg:gap-4 lg:grid-cols-6 lg:overflow-visible lg:pb-0",
                              !isMobile && (
                                 product.images.length <= 4
                                    ? "grid-cols-4"
                                    : product.images.length === 5
                                       ? "grid-cols-5"
                                       : "grid-cols-6"
                              )
                           )}>
                           {product?.images?.map((image: any, index: any) => (
                              <button
                                 key={index}
                                 onClick={() => setSelectedImage(index)}
                                 className={cn(
                                    "relative aspect-square rounded-md overflow-hidden border-2 transition-all shrink-0",
                                    isMobile ? "w-20 h-20" : "w-full",
                                    selectedImage === index
                                       ? "border-accent shadow-sm scale-95"
                                       : "border-transparent hover:border-border",
                                 )}>
                                 <img
                                    src={getImageUrl(image)}
                                    alt={`${product.name} ${index + 1}`}
                                    className="w-full h-full object-cover"
                                 />
                              </button>
                           ))}
                        </div>
                     )}
                  </motion.div>
                  {/* Product Info */}
                  <motion.div
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.5, delay: 0.1 }}
                     className="space-y-6">
                     <div>

                        <h1 className="  text-2xl font-medium lg:text-3xl">{product.name}</h1>
                        <div className="mt-3 flex items-center gap-3">
                           <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                 <Star
                                    key={i}
                                    className={cn(
                                       "h-4 w-4",
                                       i < Math.floor(product.rating)
                                          ? "fill-primary text-primary"
                                          : "fill-muted text-muted",
                                    )}
                                 />
                              ))}
                           </div>
                           <span className="text-sm text-muted-foreground">
                              {product.rating?.toFixed(1) || 0} ({reviews.length} reviews)
                           </span>
                        </div>
                     </div>



                     <div className="flex items-baseline  gap-3">
                        <span className="lg:text-3xl text-2xl font-bold">{formatCurrency(product.price)}</span>
                        {product.originalPrice && (
                           <>
                              <span className="text-xl lg:text-xl text-muted-foreground line-through">
                                 {formatCurrency(product.originalPrice)}
                              </span>
                              <Badge variant="destructive" className="hidden lg:block">
                                 Save {formatCurrency(product.originalPrice - product.price)}
                              </Badge>
                           </>
                        )}
                     </div>
                     {product.originalPrice && (
                        <Badge variant="destructive" className="lg:hidden">
                           Save {formatCurrency(product.originalPrice - product.price)}
                        </Badge>
                     )}

                     <RichTextSeeMoreViewer
                        content={product.description || ""}

                     />

                     <Separator />

                     {/* Color Selection */}
                     {product.colors?.length > 0 && (
                        <div>
                           <p className="mb-3 font-medium">

                              Color:{" "}
                              <span className="text-muted-foreground">
                                 {selectedColor || "Select a color"}
                              </span>
                           </p>
                           <div className="flex gap-3">
                              {product.colors.map((color: any) => (
                                 <button
                                    key={color.color}
                                    onClick={() => setSelectedColor(color.color)}
                                    className={cn(
                                       "h-10 w-10 rounded-full border-2 transition-all",
                                       selectedColor === color.color
                                          ? "border-primary ring-2 ring-primary ring-offset-2"
                                          : "border-muted hover:border-muted-foreground",
                                    )}
                                    style={{ backgroundColor: color.hex }}
                                    title={color.color}
                                 />
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Size Selection */}
                     {product.sizes?.length > 0 && (
                        <div>
                           <div className="mb-3 flex items-center justify-between">
                              <p className="font-medium">
                                 Size:{" "}
                                 <span className="text-muted-foreground">
                                    {selectedSize || "Select a size"}
                                 </span>
                              </p>
                              <button className="text-sm text-primary underline">Size Guide</button>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {product.sizes.map((size: any) => (
                                 <Button
                                    key={size.size}
                                    variant={selectedSize === size.size ? "default" : "outline"}
                                    size="sm"
                                    disabled={size?.quantity === 0}
                                    onClick={() => setSelectedSize(size.size)}
                                    className={cn(
                                       "min-w-[50px]",
                                       size.quantity === 0 && "line-through opacity-50",
                                    )}>
                                    {size.size}
                                 </Button>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* Quantity */}
                     <div>
                        <p className="mb-3 font-medium">Quantity</p>
                        <div className="flex items-center gap-3">
                           <div className="flex items-center border rounded-md">
                              <Button
                                 variant="ghost"
                                 size="icon"
                                 onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                 disabled={quantity <= 1}>
                                 <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">{quantity}</span>
                              <Button
                                 variant="ghost"
                                 size="icon"
                                 onClick={() =>
                                    setQuantity(
                                       Math.min(
                                          selectedSizeObj?.quantity || Infinity,
                                          quantity + 1,
                                       ),
                                    )
                                 }
                                 disabled={quantity >= (selectedSizeObj?.quantity || Infinity)}>
                                 <Plus className="h-4 w-4" />
                              </Button>
                           </div>

                        </div>
                     </div>

                     {/* Actions */}
                     <div className="flex gap-3">
                        <Button
                           size="lg"
                           variant="outline"
                           className="flex-[2] h-12 border-primary text-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 font-semibold"
                           onClick={handleAddToCart}
                           disabled={!canAddToCart}>
                           <ShoppingBag className="mr-2 h-5 w-5" />
                           Add to Cart
                        </Button>
                        <Button
                           size="lg"
                           variant="outline"
                           onClick={() => toggleItem(product)}
                           className={cn(
                              "h-12 w-12 p-0 flex-shrink-0 transition-all duration-300",
                              isWishlisted ? "text-accent border-accent" : "hover:border-primary hover:text-white"
                           )}>
                           <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
                        </Button>
                        <div className="flex-shrink-0">
                           <ShareButton
                              title={product.name}
                              className="h-12 w-12 p-0"
                           />
                        </div>
                     </div>

                     <Button
                        size="lg"
                        variant="default"
                        className="w-full  h-12 bg-black/80 text-white hover:bg-black/90"
                        onClick={handleBuyNow}
                        disabled={!canAddToCart}>
                        Buy Now
                     </Button>

                     <Accordion
                        type="single"
                        collapsible
                        className="w-full">
                        <AccordionItem value="details">
                           <AccordionTrigger>Product Details</AccordionTrigger>
                           <AccordionContent>
                              <ul className="space-y-2 text-sm text-muted-foreground">
                                 <li>Brand: {product.brand || "-"}</li>
                                 <li>Category: {typeof product.category === 'object' ? product.category?.name : product.category}</li>
                                 {product?.subcategory && (
                                    <li>Type: {typeof product.subcategory === 'object' ? product.subcategory?.name : product.subcategory}</li>
                                 )}
                                 <li>SKU: {product?.sku}</li>
                              </ul>
                           </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                  </motion.div>
               </div>
               {/* Tabs */}
               <div className="mt-16">
                  <Tabs defaultValue="description">
                     <TabsList className="w-full justify-start">
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                     </TabsList>
                     <TabsContent
                        value="description"
                        className="mt-6">
                        <RichTextViewer
                           content={product.description || ""}
                        />
                     </TabsContent>
                     <TabsContent
                        value="details"
                        className="mt-6">
                        <dl className="grid gap-4 sm:grid-cols-2 max-w-2xl">
                           <div>
                              <dt className="font-medium">Brand</dt>
                              <dd className="text-muted-foreground">{product.brand}</dd>
                           </div>
                           <div>
                              <dt className="font-medium">Category</dt>
                              <dd className="text-muted-foreground capitalize">
                                 {typeof product.category === 'object' ? product.category?.name : product.category}
                              </dd>
                           </div>
                           <div>
                              <dt className="font-medium">SKU</dt>
                              <dd className="text-muted-foreground">{product?.sku}</dd>
                           </div>
                        </dl>
                     </TabsContent>
                     <TabsContent
                        value="reviews"
                        className="mt-6">
                        <div className="grid gap-8 lg:grid-cols-12">
                           {/* Reviews List */}
                           <div className="lg:col-span-7 space-y-6">
                              {reviewsLoading ? (
                                 <div className="flex justify-center py-8">
                                    <Loader2 className="animate-spin" />
                                 </div>
                              ) : reviews.length === 0 ? (
                                 <Card className="p-8 text-center bg-muted/20 border-dashed">
                                    <div className="flex flex-col items-center gap-2">
                                       <Star className="h-8 w-8 text-muted-foreground opacity-50" />
                                       <p className="text-lg font-medium">No reviews yet</p>
                                       <p className="text-muted-foreground">
                                          Be the first to share your thoughts!
                                       </p>
                                    </div>
                                 </Card>
                              ) : (
                                 reviews.map((review: any) => (
                                    <Card
                                       key={review.id}
                                       className="p-6">
                                       <div className="flex gap-4">
                                          <Avatar className="h-10 w-10">
                                             <AvatarImage
                                                src={
                                                   review.User?.image
                                                      ? `${process.env.NEXT_PUBLIC_BASE_URL}/${review.User.image.replace(/^\/+/, "")}`
                                                      : ""
                                                }
                                             />
                                             <AvatarFallback>
                                                <User className="h-5 w-5" />
                                             </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1 space-y-1">
                                             <div className="flex items-center justify-between">
                                                <h4 className="font-semibold">
                                                   {review.User?.name || "Anonymous"}
                                                </h4>
                                                <span className="text-xs text-muted-foreground">
                                                   {formatDate(review.createdAt)}
                                                </span>
                                             </div>
                                             <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                   <Star
                                                      key={i}
                                                      className={cn(
                                                         "h-3 w-3",
                                                         i < review.rating
                                                            ? "fill-primary text-primary"
                                                            : "fill-muted text-muted",
                                                      )}
                                                   />
                                                ))}
                                             </div>
                                             <p className="text-sm text-gray-600 mt-2">
                                                {review.comment}
                                             </p>
                                          </div>
                                       </div>
                                    </Card>
                                 ))
                              )}
                           </div>

                           {/* Add Review Form */}

                           <div className="lg:col-span-5">
                              {user ? (
                                 <Card className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                                    <div className="space-y-4">
                                       <div>
                                          <label className="text-sm font-medium mb-1 block">
                                             Rating
                                          </label>
                                          <div className="flex gap-1">
                                             {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                   key={star}
                                                   type="button"
                                                   onClick={() => setNewReviewRating(star)}
                                                   className="focus:outline-none transition-transform hover:scale-110">
                                                   <Star
                                                      className={cn(
                                                         "h-6 w-6 cursor-pointer transition-colors",
                                                         star <= newReviewRating
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-muted-foreground hover:text-yellow-400",
                                                      )}
                                                   />
                                                </button>
                                             ))}
                                          </div>
                                       </div>
                                       <div>
                                          <label className="text-sm font-medium mb-1 block">
                                             Your Review
                                          </label>
                                          <Textarea
                                             placeholder="Tell us what you think about this product..."
                                             value={newReviewComment}
                                             onChange={(e) => setNewReviewComment(e.target.value)}
                                             className="min-h-[120px]"
                                          />
                                       </div>
                                       <Button
                                          onClick={handleSubmitReview}
                                          disabled={isAddingReview || newReviewRating === 0}
                                          className="w-full">
                                          {isAddingReview ? (
                                             <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                          ) : null}
                                          Submit Review
                                       </Button>
                                    </div>
                                 </Card>
                              ) : (
                                 <Card className="p-8 text-center bg-muted/30 border-dashed">
                                    <div className="flex flex-col items-center gap-4">
                                       <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                          <User className="h-6 w-6 text-primary" />
                                       </div>
                                       <div className="space-y-1">
                                          <h3 className="text-lg font-semibold">
                                             Log in to review
                                          </h3>
                                          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                             Share your thoughts with other customers by logging in
                                             to your account.
                                          </p>
                                       </div>
                                       <Button
                                          asChild
                                          className="w-full max-w-[200px] mt-2">
                                          <Link
                                             href="/login">
                                             Log In Now
                                          </Link>
                                       </Button>
                                    </div>
                                 </Card>
                              )}
                           </div>
                        </div>
                     </TabsContent>
                  </Tabs>
               </div>

               <section className="mt-16 lg:mt-24">
                  <h2 className="text-2xl lg:text-3xl  font-semibold mb-8">You May Also Like</h2>

                  {productLoading ? (
                     // 🔹 Professional loading skeleton
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
                        {Array.from({ length: 4 }).map((_, idx) => (
                           <div
                              key={idx}
                              className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
                              <div className="bg-gray-200 h-40 rounded-md w-full" />
                              <div className="h-4 bg-gray-200 rounded w-3/4" />
                              <div className="h-4 bg-gray-200 rounded w-1/2" />
                              <div className="mt-auto h-10 bg-gray-200 rounded flex items-center justify-center">
                                 <Loader2 className="animate-spin w-5 h-5 text-gray-400" />
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : relatedProducts && relatedProducts.length > 0 ? (
                     <ProductGrid
                        products={relatedProducts}
                        columns={4}
                     />
                  ) : (
                     // 🔹 Empty state with icon
                     <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 space-y-4">
                        <ShoppingCart className="w-12 h-12 opacity-50" />
                        <p className="text-lg font-medium">
                           No related products available at the moment.
                        </p>
                        <p className="text-sm">
                           Check back later or explore other products in the store.
                        </p>
                     </div>
                  )}
               </section>
            </div>
         </main>
      </div>
   );
}
