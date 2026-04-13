"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
   Check,
   MapPin,
   Truck,
   CreditCard,
   ShoppingBag,
   ArrowLeft,
   Plus,
   Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImage";
import { formatCurrency } from "@/lib/formatters";
import { useCreateOrderMutation } from "@/redux-store/apis_action/order";
import { useAuth } from "@/hook/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store";
import { trackBeginCheckout, trackPurchase } from "@/lib/analytics";

interface CustomerInfo {
   fullName: string;
   phone: string;
   address: string;
}

interface FormErrors {
   fullName?: string;
   phone?: string;
   address?: string;
}

export default function Checkout() {
   const router = useRouter();
   const { toast } = useToast();
   const { user } = useAuth();
   const { items: cartItems, getSubtotal, clearCart } = useCartStore();

   const [buyNowItem, setBuyNowItem] = useState<any>(null);
   useEffect(() => {
      const stored = typeof window !== "undefined" ? sessionStorage.getItem("buyNowItem") : null;
      if (stored) {
         try {
            const parsed = JSON.parse(stored);
            setBuyNowItem(parsed);
            if (parsed.selectedSize) setBuyNowSelectedSize(parsed.selectedSize);
            if (parsed.selectedColor) setBuyNowSelectedColor(parsed.selectedColor);
            if (parsed.quantity) setBuyNowQuantity(parsed.quantity);
         } catch {}
      }
   }, []);

   const [buyNowSelectedSize, setBuyNowSelectedSize] = useState("");
   const [buyNowSelectedColor, setBuyNowSelectedColor] = useState("");
   const [buyNowQuantity, setBuyNowQuantity] = useState(1);

   const items = useMemo(() => {
      if (buyNowItem) {
         return [
            {
               product: buyNowItem.product,
               size: buyNowSelectedSize,
               color: buyNowSelectedColor,
               quantity: buyNowQuantity,
            },
         ];
      }
      return cartItems;
   }, [buyNowItem, cartItems, buyNowSelectedSize, buyNowSelectedColor, buyNowQuantity]);

   const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
      fullName: "",
      phone: "",
      address: "",
   });
   const [shippingMethod, setShippingMethod] = useState("inside-dhaka");
   const [paymentMethod, setPaymentMethod] = useState("cod");
   const [errors, setErrors] = useState<FormErrors>({});
   const [isSubmitting, setIsSubmitting] = useState(false);

   const [createOrder] = useCreateOrderMutation();
   const { storeData } = useSelector((state: RootState) => state.store);

   const shippingConfig = storeData?.shipping || {
      inside_dhaka: { enabled: true, price: 60 },
      outside_dhaka: { enabled: true, price: 120 },
      isFreeShipping: false,
   };

   const buyNowSelectedSizeObj = useMemo(() => {
      return buyNowItem?.product?.sizes?.find(
         (s: any) => (s.name || s.size) === buyNowSelectedSize,
      );
   }, [buyNowItem, buyNowSelectedSize]);

   const canProceedBuyNow = useMemo(() => {
      if (!buyNowItem) return true;
      const hasSizes = (buyNowItem.product.sizes?.length || 0) > 0;
      const hasColors = (buyNowItem.product.colors?.length || 0) > 0;
      if (hasSizes && hasColors) {
         return !!buyNowSelectedSize && !!buyNowSelectedColor && (buyNowSelectedSizeObj?.quantity || 0) >= buyNowQuantity;
      }
      if (hasSizes && !hasColors) {
         return !!buyNowSelectedSize && (buyNowSelectedSizeObj?.quantity || 0) >= buyNowQuantity;
      }
      if (!hasSizes && hasColors) return !!buyNowSelectedColor;
      return true;
   }, [buyNowItem, buyNowSelectedSize, buyNowSelectedColor, buyNowQuantity, buyNowSelectedSizeObj]);

   const SHIPPING_OPTIONS = [
      {
         id: "inside-dhaka",
         label: "Inside Dhaka",
         price: shippingConfig.isFreeShipping ? 0 : shippingConfig.inside_dhaka.price,
         description: "Delivery within 1-2 business days",
         enabled: shippingConfig.inside_dhaka.enabled,
      },
      {
         id: "outside-dhaka",
         label: "Outside Dhaka",
         price: shippingConfig.isFreeShipping ? 0 : shippingConfig.outside_dhaka.price,
         description: "Delivery within 3-5 business days",
         enabled: shippingConfig.outside_dhaka.enabled,
      },
   ].filter((o) => o.enabled);

   const subtotal = buyNowItem ? buyNowItem.product.price * buyNowQuantity : getSubtotal();
   const shippingOption = SHIPPING_OPTIONS.find((s) => s.id === shippingMethod) || SHIPPING_OPTIONS[0];
   const shippingCost = shippingOption?.price ?? 0;
   const grandTotal = subtotal + shippingCost;

   useEffect(() => {
      if (!user) return;
      setCustomerInfo((prev) => ({
         ...prev,
         fullName: user?.name || "",
         phone: user.phone ?? "",
         address: user.address ?? "",
      }));
   }, [user]);

   useEffect(() => {
      if (items.length > 0) trackBeginCheckout(items, grandTotal);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleInputChange = (field: keyof CustomerInfo, value: string) => {
      setCustomerInfo((prev) => ({ ...prev, [field]: value }));
      if (errors[field as keyof FormErrors]) {
         setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
   };

   const validate = (): boolean => {
      if (buyNowItem && !canProceedBuyNow) {
         toast({ title: "Selection Required", description: "Please select required size and color with available stock.", variant: "destructive" });
         return false;
      }
      const newErrors: FormErrors = {};
      if (!customerInfo.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!customerInfo.phone.trim()) {
         newErrors.phone = "Phone number is required";
      } else if (!/^(\+?880|0)?1[3-9]\d{8}$/.test(customerInfo.phone.replace(/\s/g, ""))) {
         newErrors.phone = "Please enter a valid phone number";
      }
      if (!customerInfo.address.trim()) newErrors.address = "Delivery address is required";
      setErrors(newErrors);
      const errorKeys = Object.keys(newErrors);
      if (errorKeys.length > 0) {
         const el = document.getElementById(errorKeys[0]);
         if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.focus({ preventScroll: true }); }
         return false;
      }
      return true;
   };

   const handleConfirmOrder = async () => {
      if (!validate()) return;
      setIsSubmitting(true);
      try {
         const [firstName, ...lastNameParts] = customerInfo.fullName.trim().split(" ");
         const lastName = lastNameParts.join(" ") || "";
         const orderData = {
            items: items.map((item) => ({
               productId: item.product.id,
               quantity: item.quantity,
               size: item.size,
               color: item.color,
            })),
            shippingAddress: {
               firstName,
               lastName,
               address1: customerInfo.address,
               address2: "",
               city: "",
               state: "",
               postalCode: "",
               country: "Bangladesh",
               phone: customerInfo.phone,
               email: user?.email || "",
            },
            billingAddress: null,
            paymentMethod: paymentMethod === "cod" ? "Cash On Delivery" : paymentMethod,
            subtotal,
            tax: 0,
            shippingCharge: shippingCost,
            total: grandTotal,
            userId: user?.id || null,
         };
         const res = await createOrder(orderData).unwrap();
         trackPurchase(res?.order ?? {}, items, grandTotal, shippingCost);
         if (!buyNowItem) clearCart();
         toast({ title: "Order placed successfully!", description: `Thank you for your purchase. Total Cost: ${formatCurrency(grandTotal)}` });
         router.push(`/order/details/${res?.order?.orderNumber}`);
      } catch {
         toast({ title: "Order placement failed!", description: "There was an issue placing your order. Please try again." });
      } finally {
         setIsSubmitting(false);
      }
   };

   if (items.length === 0) {
      return (
         <div className="flex min-h-screen flex-col">
            <main className="flex-1 flex items-center justify-center pb-16 lg:pb-0">
               <div className="text-center px-4">
                  <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
                  <p className="text-muted-foreground mb-6">Add some products to checkout</p>
                  <Button onClick={() => router.push("/products")}>Browse Products</Button>
               </div>
            </main>
         </div>
      );
   }

   const ConfirmButton = () => (
      <Button
         onClick={handleConfirmOrder}
         disabled={isSubmitting}
         className="w-full h-12 text-base gap-2 bg-green-600 hover:bg-green-700">
         {isSubmitting ? (
            <><span className="animate-spin">●</span> Processing...</>
         ) : (
            <><Check className="h-5 w-5" /> Confirm Order</>
         )}
      </Button>
   );

   return (
      <div className="flex min-h-screen flex-col bg-background">
         <main className="flex-1 pb-16 lg:pb-0">
            <div className="container py-6 lg:py-8">
              

               <div className="grid gap-8 lg:grid-cols-3">
                  {/* ── Left: Form Sections ── */}
                  <div className="lg:col-span-2 space-y-6">

                     {/* Buy Now Product Customization */}
                     {buyNowItem && (
                        <div className="rounded-xl border bg-card p-6">
                           <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                              <ShoppingBag className="h-5 w-5 text-primary" />
                              Your Product
                           </h2>
                           <div className="space-y-6">
                              <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
                                 <div className="h-24 w-24 rounded-lg bg-secondary/30 overflow-hidden shrink-0">
                                    <img src={getImageUrl(buyNowItem.product.images[0])} alt={buyNowItem.product.name} className="h-full w-full object-cover" />
                                 </div>
                                 <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-1">{buyNowItem.product.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">{buyNowItem.product.brand}</p>
                                    <p className="text-xl font-bold text-primary">{formatCurrency(buyNowItem.product.price)}</p>
                                 </div>
                              </div>

                              {buyNowItem.product.sizes?.length > 0 && (
                                 <div className="space-y-3">
                                    <Label className="text-base font-semibold">Select Size <span className="text-destructive">*</span></Label>
                                    <div className="flex flex-wrap gap-3">
                                       {buyNowItem.product.sizes.map((size: any) => {
                                          const isAvailable = (size.quantity || 0) > 0;
                                          const isSelected = buyNowSelectedSize === (size.name || size.size);
                                          return (
                                             <button
                                                key={size.name || size.size}
                                                onClick={() => isAvailable && setBuyNowSelectedSize(size.name || size.size || "")}
                                                disabled={!isAvailable}
                                                className={cn(
                                                   "min-w-[40px] h-10 px-3  border-2 font-semibold transition-all duration-300",
                                                   isSelected ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                                                      : isAvailable ? "border-border hover:border-primary/50 hover:bg-primary/5"
                                                      : "border-dashed opacity-40 cursor-not-allowed line-through",
                                                )}>
                                                {size.name || size.size}
                                             </button>
                                          );
                                       })}
                                    </div>
                                 </div>
                              )}

                              {buyNowItem.product.colors?.length > 0 && (
                                 <div className="space-y-3">
                                    <Label className="text-base font-semibold flex items-center justify-between">
                                       <span>Select Color <span className="text-destructive">*</span></span>
                                       <span className="text-sm font-normal text-muted-foreground">{buyNowSelectedColor}</span>
                                    </Label>
                                    <div className="flex flex-wrap gap-4">
                                       {buyNowItem.product.colors.map((color: any) => {
                                          const isSelected = buyNowSelectedColor === color.color;
                                          return (
                                             <button key={color.color} onClick={() => setBuyNowSelectedColor(color.color)} className="group flex flex-col items-center gap-2">
                                                <div className={cn("h-8 w-8 rounded-full border shadow-sm transition-all duration-300", isSelected ? "ring-2 ring-primary ring-offset-2 scale-110" : "hover:scale-110 hover:shadow-md")} style={{ backgroundColor: color.hex }} />
                                                <span className={cn("text-[10px] uppercase tracking-wider font-bold", isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}>{color.color}</span>
                                             </button>
                                          );
                                       })}
                                    </div>
                                 </div>
                              )}

                              <div className="space-y-3">
                                 <Label className="text-base font-semibold">Quantity <span className="text-destructive">*</span></Label>
                                 <div className="flex items-center border rounded-md h-10 w-fit">
                                    <Button variant="ghost" size="icon" onClick={() => setBuyNowQuantity(Math.max(1, buyNowQuantity - 1))} disabled={buyNowQuantity <= 1}>
                                       <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-12 text-center font-medium">{buyNowQuantity}</span>
                                    <Button variant="ghost" size="icon"
                                       onClick={() => { const max = buyNowSelectedSizeObj?.quantity || Infinity; setBuyNowQuantity(Math.min(buyNowQuantity + 1, max)); }}
                                       disabled={buyNowQuantity >= (buyNowSelectedSizeObj?.quantity || Infinity)}>
                                       <Plus className="h-4 w-4" />
                                    </Button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* Delivery Information */}
                     <div className="rounded-xl border bg-card p-6">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                           <MapPin className="h-5 w-5 text-primary" />
                           Delivery Information
                        </h2>
                        <div className="grid gap-5">
                           <div className="space-y-2">
                              <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                              <Input id="fullName" placeholder="Enter your full name" value={customerInfo.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} className={cn(errors.fullName && "border-destructive")} />
                              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                              <Input id="phone" placeholder="01XXXXXXXXX" value={customerInfo.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className={cn(errors.phone && "border-destructive")} />
                              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="address">Full Address <span className="text-destructive">*</span></Label>
                              <Input id="address" placeholder="House/Flat, Road, Block, Sector" value={customerInfo.address} onChange={(e) => handleInputChange("address", e.target.value)} className={cn(errors.address && "border-destructive")} />
                              {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                           </div>
                        </div>
                     </div>

                     {/* Shipping Method */}
                     {!shippingConfig.isFreeShipping && (
                        <div className="rounded-xl border bg-card p-6">
                           <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                              <Truck className="h-5 w-5 text-primary" />
                              Shipping Method
                           </h2>
                           <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                              <div className="space-y-3">
                                 {SHIPPING_OPTIONS.map((option) => (
                                    <label key={option.id} className={cn("flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-all", shippingMethod === option.id ? "border-primary bg-primary/5" : "hover:border-primary/50")}>
                                       <div className="flex items-center gap-3">
                                          <RadioGroupItem value={option.id} id={option.id} />
                                          <div>
                                             <p className="font-medium">{option.label}</p>
                                             <p className="text-sm text-muted-foreground">{option.description}</p>
                                          </div>
                                       </div>
                                       <span className="text-lg font-semibold text-primary">{option.price === 0 ? "Free" : `৳${option.price}`}</span>
                                    </label>
                                 ))}
                              </div>
                           </RadioGroup>
                        </div>
                     )}

                     {/* Payment Method */}
                     <div className="rounded-xl border bg-card p-6">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                           <CreditCard className="h-5 w-5 text-primary" />
                           Payment Method
                        </h2>
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                           <label className={cn("flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all", paymentMethod === "cod" ? "border-primary bg-primary/5" : "hover:border-primary/50")}>
                              <RadioGroupItem value="cod" id="cod" />
                              <div className="flex-1">
                                 <div className="flex items-center gap-2">
                                    <p className="font-medium">Cash on Delivery</p>
                                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">Recommended</span>
                                 </div>
                                 <p className="text-sm text-muted-foreground mt-1">Pay with cash when your order is delivered to your doorstep</p>
                              </div>
                           </label>
                        </RadioGroup>
                     </div>

                     {/* Confirm Button — Desktop only (below form) */}
                     <div className="hidden lg:block">
                        <ConfirmButton />
                     </div>
                  </div>

                  {/* ── Right: Order Summary ── */}
                  <div className="lg:col-span-1">
                     <div className="rounded-xl border bg-card p-6 lg:sticky lg:top-24">
                        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                        <div className="space-y-3 pt-2 mb-4 max-h-52 overflow-y-auto">
                           {items.map((item: any, index: any) => (
                              <div key={`sidebar-${item.product.id}-${item.size}-${item.color}-${index}`} className="flex items-center gap-3">
                                 <div className="relative h-12 w-12 rounded-lg bg-secondary/30 shrink-0">
                                    <img src={getImageUrl(item.product.images[0])} alt={item.product.name} className="h-full w-full rounded-lg object-cover" />
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">{item.quantity}</span>
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.size}</p>
                                 </div>
                                 <p className="text-sm font-medium shrink-0">{formatCurrency(item.product.price * item.quantity)}</p>
                              </div>
                           ))}
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-3">
                           <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span>{formatCurrency(subtotal)}</span>
                           </div>
                           <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Shipping</span>
                              <span>{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</span>
                           </div>
                           <Separator />
                           <div className="flex justify-between text-lg font-semibold">
                              <span>Grand Total</span>
                              <span className="text-primary">{formatCurrency(grandTotal)}</span>
                           </div>
                        </div>
                     </div>

                     {/* Confirm Button — Mobile only (below summary) */}
                     <div className="lg:hidden mt-6">
                        <ConfirmButton />
                     </div>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
}
