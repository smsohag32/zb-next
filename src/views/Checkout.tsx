"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
   Check,
   ChevronRight,
   MapPin,
   Truck,
   CreditCard,
   ShoppingBag,
   ArrowLeft,
   Plus,
   Minus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

import { useIsMobile } from "@/hooks/use-mobile";
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
   // buyNowItem read from sessionStorage (set by ProductDetail handleBuyNow)
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
         } catch { }
      }
   }, []);

   // Buy Now item state
   const [buyNowSelectedSize, setBuyNowSelectedSize] = useState("");
   const [buyNowSelectedColor, setBuyNowSelectedColor] = useState("");
   const [buyNowQuantity, setBuyNowQuantity] = useState(1);

   // Use buyNowItem if present, otherwise fallback to cart items
   const items = useMemo(() => {
      if (buyNowItem) {
         return [{
            product: buyNowItem.product,
            size: buyNowSelectedSize,
            color: buyNowSelectedColor,
            quantity: buyNowQuantity
         }];
      }
      return cartItems;
   }, [buyNowItem, cartItems, buyNowSelectedSize, buyNowSelectedColor, buyNowQuantity]);

   const [currentStep, setCurrentStep] = useState(1);
   const isMobile = useIsMobile();
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
   const storeName = storeData?.name || "ZBazar BD";

   const shippingConfig = storeData?.shipping || {
      inside_dhaka: { enabled: true, price: 60 },
      outside_dhaka: { enabled: true, price: 120 },
      isFreeShipping: false,
   };

   // Selected size object for stock check
   const buyNowSelectedSizeObj = useMemo(() => {
      return buyNowItem?.product?.sizes?.find(
         (s: any) => (s.name || s.size) === buyNowSelectedSize
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
      if (!hasSizes && hasColors) {
         return !!buyNowSelectedColor;
      }
      return true;
   }, [buyNowItem, buyNowSelectedSize, buyNowSelectedColor, buyNowQuantity, buyNowSelectedSizeObj]);

   const SHIPPING_OPTIONS = [
      {
         id: "inside-dhaka",
         label: "Inside Dhaka",
         price: shippingConfig.isFreeShipping ? 0 : shippingConfig.inside_dhaka.price,
         description: "Delivery within 1-2 business days",
         enabled: shippingConfig.inside_dhaka.enabled
      },
      {
         id: "outside-dhaka",
         label: "Outside Dhaka",
         price: shippingConfig.isFreeShipping ? 0 : shippingConfig.outside_dhaka.price,
         description: "Delivery within 3-5 business days",
         enabled: shippingConfig.outside_dhaka.enabled
      },
   ].filter(option => option.enabled);

   const subtotal = buyNowItem
      ? buyNowItem.product.price * buyNowQuantity
      : getSubtotal();

   const shippingOption = SHIPPING_OPTIONS.find((s) => s.id === shippingMethod) || SHIPPING_OPTIONS[0];
   const shippingCost = shippingOption?.price ?? 0;
   const grandTotal = subtotal + shippingCost;

   const steps = useMemo(() => {
      if (isMobile) {
         return [
            { id: 1, title: "Information", icon: MapPin },
            { id: 2, title: "Review", icon: ShoppingBag },
         ];
      }

      const availableSteps = [
         { id: 1, title: "Address", icon: MapPin },
      ];

      let nextId = 2;
      if (!shippingConfig.isFreeShipping) {
         availableSteps.push({ id: nextId++, title: "Shipping", icon: Truck });
      }
      availableSteps.push({ id: nextId++, title: "Payment", icon: CreditCard });
      availableSteps.push({ id: nextId++, title: "Review", icon: ShoppingBag });

      return availableSteps;
   }, [isMobile, shippingConfig.isFreeShipping]);

   const totalSteps = steps.length;
   const lastStepId = steps[steps.length - 1].id;

   const validateStep1 = (): boolean => {
      const newErrors: FormErrors = {};

      if (buyNowItem && !canProceedBuyNow) {
         toast({
            title: "Selection Required",
            description: "Please select required size and color with available stock.",
            variant: "destructive",
         });
         return false;
      }

      if (!customerInfo.fullName.trim()) {
         newErrors.fullName = "Full name is required";
      }
      if (!customerInfo.phone.trim()) {
         newErrors.phone = "Phone number is required";
      } else if (!/^(\+?880|0)?1[3-9]\d{8}$/.test(customerInfo.phone.replace(/\s/g, ""))) {
         newErrors.phone = "Please enter a valid phone number";
      }
      if (!customerInfo.address.trim()) {
         newErrors.address = "Delivery address is required";
      }

      setErrors(newErrors);

      const errorKeys = Object.keys(newErrors);
      if (errorKeys.length > 0) {
         // Scroll to the first element with an error
         const firstErrorKey = errorKeys[0];
         const element = document.getElementById(firstErrorKey);
         if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.focus({ preventScroll: true });
         }
         return false;
      }

      return true;
   };

   const nextStep = () => {
      if (currentStep === 1 && !validateStep1()) {
         return;
      }
      if (currentStep < totalSteps) {
         setCurrentStep(currentStep + 1);
         window.scrollTo({ top: 0, behavior: "smooth" });
      }
   };

   const prevStep = () => {
      if (currentStep > 1) {
         setCurrentStep(currentStep - 1);
         window.scrollTo({ top: 0, behavior: "smooth" });
      }
   };

   useEffect(() => {
      if (!user) return;

      setCustomerInfo((prev) => ({
         ...prev,
         fullName: user?.name || "",
         phone: user.phone ?? "",
         address: user.address ?? "",
      }));
   }, [user]);

   // GA4 — begin_checkout (fires once when the page mounts with items)
   useEffect(() => {
      if (items.length > 0) {
         trackBeginCheckout(items, grandTotal);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []); // intentionally runs once on mount

   const handleInputChange = (field: keyof CustomerInfo, value: string) => {
      setCustomerInfo((prev) => ({ ...prev, [field]: value }));
      if (errors[field as keyof FormErrors]) {
         setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
   };

   const handleConfirmOrder = async () => {
      setIsSubmitting(true);

      try {
         // Split fullName into firstName and lastName
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
            billingAddress: null, // can be same as shipping if needed
            paymentMethod: paymentMethod === "cod" ? "Cash On Delivery" : paymentMethod,
            subtotal,
            tax: 0, // adjust if you have tax calculation
            shippingCharge: shippingCost,
            total: grandTotal,
            userId: user?.id || null,
         };

         // Simulate API call
         const res = await createOrder(orderData).unwrap(); // Replace with your actual API call

         // GA4 — purchase
         trackPurchase(res?.order ?? {}, items, grandTotal, shippingCost);

         if (!buyNowItem) {
            clearCart();
         }

         toast({
            title: "Order placed successfully!",
            description: `Thank you for your purchase. Total Cost: ${formatCurrency(grandTotal)}`,
         });

         router.push(`/order/details/${res?.order?.orderNumber}`);
      } catch (err) {
         toast({
            title: "Order placement failed!",
            description: "There was an issue placing your order. Please try again.",
         });
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

   return (
      <div className="flex min-h-screen flex-col bg-background">
         <main className="flex-1 pb-16 lg:pb-0">
            <div className="container py-6 lg:py-8">
               {/* Back Button */}
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => buyNowItem ? router.back() : router.push("/cart")}
                  className="mb-6 gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {buyNowItem ? "Back to Product" : "Back to Cart"}
               </Button>

               {/* Progress Steps */}
               <div className="mb-8">
                  <div className="flex items-center justify-center max-w-lg mx-auto w-full px-4">
                     {steps.map((step, index) => (
                        <div
                           key={step.id}
                           className={cn(
                              "flex items-center",
                              index < steps.length - 1 ? "flex-1" : ""
                           )}>
                           <div className="flex flex-col items-center">
                              <div
                                 className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all shrink-0",
                                    currentStep > step.id
                                       ? "bg-primary border-primary text-primary-foreground"
                                       : currentStep === step.id
                                          ? "border-primary text-primary"
                                          : "border-muted text-muted-foreground",
                                 )}>
                                 {currentStep > step.id ? (
                                    <Check className="h-5 w-5" />
                                 ) : (
                                    <step.icon className="h-5 w-5" />
                                 )}
                              </div>
                              <span
                                 className={cn(
                                    "mt-2 text-[10px] font-medium hidden sm:block",
                                    currentStep >= step.id
                                       ? "text-foreground"
                                       : "text-muted-foreground",
                                 )}>
                                 {step.title}
                              </span>
                           </div>

                           {index < steps.length - 1 && (
                              <div
                                 className={cn(
                                    "h-0.5 flex-1 mx-2",
                                    currentStep > (steps[index]?.id || 0) ? "bg-primary" : "bg-muted",
                                 )}
                              />
                           )}
                        </div>
                     ))}
                  </div>
               </div>

               <div className="grid gap-8 lg:grid-cols-3">
                  {/* Main Content */}
                  <div className="lg:col-span-2">
                     <AnimatePresence mode="wait">
                        {/* Step 1: Information (Address, Shipping, Payment) */}
                        {currentStep === 1 && (
                           <motion.div
                              key="step1"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-6">
                              {/* Buy Now Product Customization - Only show for buyNowItem */}
                              {buyNowItem && (
                                 <div className="rounded-xl border bg-card p-6">
                                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                       <ShoppingBag className="h-5 w-5 text-primary" />
                                       Your Product
                                    </h2>

                                    <div className="space-y-6">
                                       {/* Product Preview */}
                                       <div className="flex gap-4 p-4 rounded-lg bg-muted/30">
                                          <div className="h-24 w-24 rounded-lg bg-secondary/30 overflow-hidden shrink-0">
                                             <img
                                                src={getImageUrl(buyNowItem.product.images[0])}
                                                alt={buyNowItem.product.name}
                                                className="h-full w-full object-cover"
                                             />
                                          </div>
                                          <div className="flex-1">
                                             <h3 className="font-semibold text-lg mb-1">{buyNowItem.product.name}</h3>
                                             <p className="text-sm text-muted-foreground mb-2">{buyNowItem.product.brand}</p>
                                             <p className="text-xl font-bold text-primary">
                                                {formatCurrency(buyNowItem.product.price)}
                                             </p>
                                          </div>
                                       </div>

                                       {/* Size Selection */}
                                       {buyNowItem.product.sizes && buyNowItem.product.sizes.length > 0 && (
                                          <div className="space-y-3">
                                             <Label className="text-base font-semibold">
                                                Select Size <span className="text-destructive">*</span>
                                             </Label>
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
                                                            "min-w-[40px] text-sm! h-10 px-2 rounded-full border-2 font-semibold transition-all duration-300",
                                                            isSelected
                                                               ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                                                               : isAvailable
                                                                  ? "border-border hover:border-primary/50 hover:bg-primary/5"
                                                                  : "border-dashed opacity-40 cursor-not-allowed line-through"
                                                         )}>
                                                         <div className="flex flex-col items-center leading-tight">
                                                            <span>{size.name || size.size}</span>

                                                         </div>
                                                      </button>
                                                   );
                                                })}
                                             </div>
                                          </div>
                                       )}

                                       {/* Color Selection */}
                                       {buyNowItem.product.colors && buyNowItem.product.colors.length > 0 && (
                                          <div className="space-y-3">
                                             <Label className="text-base font-semibold flex items-center justify-between">
                                                <span>Select Color <span className="text-destructive">*</span></span>
                                                <span className="text-sm font-normal text-muted-foreground">{buyNowSelectedColor}</span>
                                             </Label>
                                             <div className="flex flex-wrap gap-4">
                                                {buyNowItem.product.colors.map((color: any) => {
                                                   const isSelected = buyNowSelectedColor === color.color;
                                                   return (
                                                      <button
                                                         key={color.color}
                                                         onClick={() => setBuyNowSelectedColor(color.color)}
                                                         className={cn(
                                                            "group relative flex flex-col items-center gap-2"
                                                         )}>
                                                         <div className={cn(
                                                            "h-8 w-8 rounded-full border shadow-sm transition-all duration-300",
                                                            isSelected
                                                               ? "ring-2 ring-primary ring-offset-2 scale-110"
                                                               : "hover:scale-110 hover:shadow-md"
                                                         )}
                                                            style={{ backgroundColor: color.hex }}
                                                         />
                                                         <span className={cn(
                                                            "text-[10px] uppercase tracking-wider font-bold transition-colors",
                                                            isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                                         )}>
                                                            {color.color}
                                                         </span>
                                                      </button>
                                                   );
                                                })}
                                             </div>
                                          </div>
                                       )}

                                       {/* Quantity Selection */}
                                       <div className="space-y-3">
                                          <Label className="text-base font-semibold">
                                             Quantity <span className="text-destructive">*</span>
                                          </Label>
                                          <div className="flex items-center gap-3">
                                             <div className="flex items-center border rounded-md h-10">
                                                <Button
                                                   variant="ghost"
                                                   size="icon"
                                                   onClick={() => setBuyNowQuantity(Math.max(1, buyNowQuantity - 1))}
                                                   disabled={buyNowQuantity <= 1}>
                                                   <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="w-12 text-center font-medium">{buyNowQuantity}</span>
                                                <Button
                                                   variant="ghost"
                                                   size="icon"
                                                   onClick={() => {
                                                      const maxQty = buyNowSelectedSizeObj?.quantity || Infinity;
                                                      setBuyNowQuantity(Math.min(buyNowQuantity + 1, maxQty));
                                                   }}
                                                   disabled={buyNowQuantity >= (buyNowSelectedSizeObj?.quantity || Infinity)}>
                                                   <Plus className="h-4 w-4" />
                                                </Button>
                                             </div>

                                          </div>
                                       </div>


                                    </div>
                                 </div>
                              )}

                              <div className="rounded-xl border bg-card p-6">
                                 <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Delivery Information
                                 </h2>

                                 <div className="grid gap-5">
                                    {/* Full Name */}
                                    <div className="space-y-2">
                                       <Label htmlFor="fullName">
                                          Full Name <span className="text-destructive">*</span>
                                       </Label>
                                       <Input
                                          id="fullName"
                                          placeholder="Enter your full name"
                                          value={customerInfo.fullName}
                                          onChange={(e) =>
                                             handleInputChange("fullName", e.target.value)
                                          }
                                          className={cn(errors.fullName && "border-destructive")}
                                       />
                                       {errors.fullName && (
                                          <p className="text-sm text-destructive">{errors.fullName}</p>
                                       )}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                       <Label htmlFor="phone">
                                          Phone Number <span className="text-destructive">*</span>
                                       </Label>
                                       <Input
                                          id="phone"
                                          placeholder="01XXXXXXXXX"
                                          value={customerInfo.phone}
                                          onChange={(e) => handleInputChange("phone", e.target.value)}
                                          className={cn(errors.phone && "border-destructive")}
                                       />
                                       {errors.phone && (
                                          <p className="text-sm text-destructive">{errors.phone}</p>
                                       )}
                                    </div>

                                    {/* Full Address */}
                                    <div className="space-y-2">
                                       <Label htmlFor="address">
                                          Full Address <span className="text-destructive">*</span>
                                       </Label>
                                       <Input
                                          id="address"
                                          placeholder="House/Flat, Road, Block, Sector"
                                          value={customerInfo.address}
                                          onChange={(e) =>
                                             handleInputChange("address", e.target.value)
                                          }
                                          className={cn(errors.address && "border-destructive")}
                                       />
                                       {errors.address && (
                                          <p className="text-sm text-destructive">{errors.address}</p>
                                       )}
                                    </div>
                                 </div>
                              </div>

                              {/* Shipping & Payment integrated in Step 1 for Mobile */}
                              {isMobile && currentStep === 1 && (
                                 <>
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
                                 </>
                              )}
                           </motion.div>
                        )}

                        {/* Steps for desktop only */}
                        {!isMobile && (
                           <>
                              {/* Step 2: Shipping Method (Only if not free) */}
                              {!shippingConfig.isFreeShipping && currentStep === 2 && (
                                 <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="rounded-xl border bg-card p-6">
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
                                 </motion.div>
                              )}

                              {/* Step 3: Payment Method (ID shifts if shipping skipped) */}
                              {currentStep === (shippingConfig.isFreeShipping ? 2 : 3) && (
                                 <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="rounded-xl border bg-card p-6">
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
                                 </motion.div>
                              )}
                           </>
                        )}

                        {/* Review Step (Last Step for both) */}
                        {currentStep === lastStepId && (
                           <motion.div
                              key="review"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-6">
                              {/* Delivery Address */}
                              <div className="rounded-xl border bg-card p-6">
                                 <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                       <MapPin className="h-4 w-4 text-primary" />
                                       Delivery Address
                                    </h3>
                                    <Button
                                       variant="ghost"
                                       size="sm"
                                       onClick={() => setCurrentStep(1)}>
                                       Edit
                                    </Button>
                                 </div>
                                 <div className="text-sm space-y-1">
                                    <p className="font-medium">{customerInfo.fullName}</p>
                                    <p className="text-muted-foreground">{customerInfo.phone}</p>
                                    <p className="text-muted-foreground">{customerInfo.address}</p>
                                 </div>
                              </div>

                              {/* Shipping & Payment */}
                              <div className="rounded-xl border bg-card p-6">
                                 <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                       <Truck className="h-4 w-4 text-primary" />
                                       Shipping & Payment
                                    </h3>
                                    <Button
                                       variant="ghost"
                                       size="sm"
                                       onClick={() => setCurrentStep(2)}>
                                       Edit
                                    </Button>
                                 </div>
                                 <div className="text-sm space-y-2">
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">Shipping:</span>
                                       <span className="font-medium">
                                          {
                                             SHIPPING_OPTIONS.find((s) => s.id === shippingMethod)
                                                ?.label
                                          }{" "}
                                          ({shippingCost === 0 ? "Free" : `৳${shippingCost}`})
                                       </span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">Payment:</span>
                                       <span className="font-medium">Cash on Delivery</span>
                                    </div>
                                 </div>
                              </div>

                              {/* Order Items */}
                              <div className="rounded-xl border bg-card p-6">
                                 <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <ShoppingBag className="h-4 w-4 text-primary" />
                                    Order Items ({items.length})
                                 </h3>
                                 <div className="space-y-4">
                                    {items.map((item, index) => (
                                       <div
                                          key={`${item.product.id}-${item.size}-${item.color}-${index}`}
                                          className="flex gap-3">
                                          <div className="h-16 w-16 rounded-lg bg-secondary/30 overflow-hidden shrink-0">
                                             <img
                                                src={getImageUrl(item.product.images[0])}
                                                alt={item.product.name}
                                                className="h-full w-full object-cover"
                                             />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                             <p className="font-medium text-sm line-clamp-1">
                                                {item.product.name}
                                             </p>
                                             <p className="text-xs text-muted-foreground">
                                                {item.size} / {item.color} × {item.quantity}
                                             </p>
                                          </div>
                                          <p className="font-medium shrink-0">
                                             ৳{(item.product.price * item.quantity).toFixed(0)}
                                          </p>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>

                     {/* Navigation Buttons (Desktop) */}
                     {!isMobile && (
                        <div className="flex justify-between mt-6">
                           <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="gap-2">
                              <ArrowLeft className="h-4 w-4" />
                              Previous
                           </Button>
                           {currentStep < totalSteps ? (
                              <Button onClick={nextStep} className="gap-2">
                                 Next
                                 <ChevronRight className="h-4 w-4" />
                              </Button>
                           ) : (
                              <Button onClick={handleConfirmOrder} disabled={isSubmitting} className="gap-2 bg-green-600 hover:bg-green-700">
                                 {isSubmitting ? (
                                    <>
                                       <span className="animate-spin">●</span>
                                       Processing...
                                    </>
                                 ) : (
                                    <>
                                       <Check className="h-4 w-4" />
                                       Confirm Order
                                    </>
                                 )}
                              </Button>
                           )}
                        </div>
                     )}
                  </div>

                  {/* Order Summary Sidebar */}
                  <div className="lg:col-span-1">
                     <div className={cn("rounded-xl border bg-card p-6", !isMobile && "sticky top-24")}>
                        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                        {/* Items Preview */}
                        <div className="space-y-3 pt-4 mb-4 max-h-48 overflow-y-auto">
                           {items.map((item: any, index: any) => (
                              <div
                                 key={`sidebar-${item.product.id}-${item.size}-${item.color}-${index}`}
                                 className="flex items-center gap-3">
                                 <div className="relative h-12 w-12 rounded-lg bg-secondary/30  shrink-0">
                                    <img
                                       src={getImageUrl(item.product.images[0])}
                                       alt={item.product.name}
                                       className="h-full w-full rounded-lg object-cover"
                                    />
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                       {item.quantity}
                                    </span>
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-1">
                                       {item.product.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{item.size}</p>
                                 </div>
                                 <p className="text-sm font-medium shrink-0">
                                    {formatCurrency(item.product.price * item.quantity)}
                                 </p>
                              </div>
                           ))}
                        </div>

                        <Separator className="my-4" />

                        {/* Totals */}
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

                        {/* Security Badge */}
                        <div className="mt-6 p-3 rounded-lg bg-muted/50 text-center">
                           <p className="text-xs text-muted-foreground">
                              🔒 Secure checkout • 100% satisfaction guaranteed
                           </p>
                        </div>
                     </div>

                     {/* Navigation Buttons (Mobile) */}
                     {isMobile && (
                        <div className="flex justify-between mt-6 px-1">
                           <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="gap-2">
                              <ArrowLeft className="h-4 w-4" />
                              Previous
                           </Button>
                           {currentStep < totalSteps ? (
                              <Button onClick={nextStep} className="gap-2">
                                 Next
                                 <ChevronRight className="h-4 w-4" />
                              </Button>
                           ) : (
                              <Button onClick={handleConfirmOrder} disabled={isSubmitting} className="gap-2 bg-green-600 hover:bg-green-700">
                                 {isSubmitting ? (
                                    <>
                                       <span className="animate-spin mr-2">●</span>
                                       Processing...
                                    </>
                                 ) : (
                                    <>
                                       <Check className="h-4 w-4 mr-2" />
                                       Confirm Order
                                    </>
                                 )}
                              </Button>
                           )}
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
}
