"use client";

import { X, Plus, Minus, ShoppingBag, ArrowRight, ClockAlert } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/stores/cartStore";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import { CartItem } from "@/components/cart/CartItem";

export function CartSheet() {
   const { items, isOpen, closeCart, removeItem, updateQuantity, updateItemOptions, getSubtotal } =
      useCartStore();
   const subtotal = getSubtotal();

   // Determine if checkout is allowed
   const canCheckout = items.every((item) => {
      const hasSizes = item.product.sizes && item.product.sizes.length > 0;
      const hasColors = item.product.colors && item.product.colors.length > 0;

      const sizeValid =
         !hasSizes || (item.size && item.product.sizes.some((s: any) => s.size === item.size));
      const colorValid =
         !hasColors || (item.color && item.product.colors.some((c: any) => c.color === item.color));

      return sizeValid && colorValid;
   });

   return (
      <Sheet
         open={isOpen}
         onOpenChange={(open) => !open && closeCart()}>
         <SheetContent className="flex w-full flex-col sm:max-w-lg">
            <SheetHeader className="px-1">
               <SheetTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" /> Shopping Cart ({items.length})
               </SheetTitle>
            </SheetHeader>

            {items.length === 0 ? (
               <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
                  <div>
                     <p className="font-medium">Your cart is empty</p>
                     <p className="text-sm text-muted-foreground">Add some items to get started</p>
                  </div>
                  <Button
                     onClick={closeCart}
                     asChild>
                     <Link href="/products">Continue Shopping</Link>
                  </Button>
               </div>
            ) : (
               <>
                  <ScrollArea className="flex-1 -mx-6 px-6">
                     <div className="space-y-4">
                        {items.map((item) => (
                           <div key={`${item.product.id}-${item.size}-${item.color}`} className="relative">
                              <CartItem
                                 item={item}
                                 updateQuantity={updateQuantity}
                                 updateItemOptions={updateItemOptions}
                                 removeItem={removeItem}
                                 closeCart={closeCart}
                                 compact
                              />
                           </div>
                        ))}
                     </div>
                  </ScrollArea>

                  {/* Summary & Actions */}
                  <div className="space-y-4 pt-4">
                     <Separator />
                     <div className="flex items-center justify-between text-lg font-semibold">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                     </div>
                     <p className="text-sm text-muted-foreground">
                        Shipping and taxes calculated at checkout
                     </p>
                     <div className="grid gap-2">
                        <Button
                           size="lg"
                           asChild
                           disabled={!canCheckout}
                           onClick={() => closeCart()}>
                           <Link href="/checkout">Proceed to Checkout</Link>
                        </Button>
                        <Button
                           variant="outline"
                           size="lg"
                           asChild
                           onClick={closeCart}>
                           <Link href="/cart">View Full Cart</Link>
                        </Button>
                     </div>
                  </div>
               </>
            )}
         </SheetContent>
      </Sheet>
   );
}
