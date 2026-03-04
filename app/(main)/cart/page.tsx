"use client";

import Link from "next/link";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cartStore";
import { formatCurrency } from "@/lib/formatters";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux-store";
import { CartItem } from "@/components/cart/CartItem";

export default function CartPage() {
    const { items, removeItem, updateQuantity, updateItemOptions, getSubtotal, clearCart } = useCartStore();
    const subtotal = getSubtotal();
    const { storeData } = useSelector((state: RootState) => state.store);
    const shipping = storeData?.shipping?.isFreeShipping ? 0 : (storeData?.shipping?.inside_dhaka?.price || 60);
    const total = subtotal + shipping;

    if (items.length === 0) {
        return (
            <main className="flex-1 flex items-center justify-center min-h-[60vh] pb-16 lg:pb-0">
                <div className="text-center">
                    <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/50" />
                    <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
                    <p className="mt-2 text-muted-foreground">Add some items to get started</p>
                    <Button asChild className="mt-6">
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 pb-16 lg:pb-0">
            <div className="container py-8">
                <h1 className="text-2xl font-medium lg:text-3xl">Shopping Cart</h1>
                <p className="mt-2 text-muted-foreground">{items.length} items in your cart</p>
                <div className="mt-8 grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item, index) => (
                            <motion.div
                                key={`${item.product.id}-${item.size}-${item.color}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}>
                                <CartItem item={item} updateQuantity={updateQuantity} updateItemOptions={updateItemOptions} removeItem={removeItem} />
                            </motion.div>
                        ))}
                        <div className="flex justify-between pt-4">
                            <Button variant="ghost" asChild><Link href="/products">Continue Shopping</Link></Button>
                            <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="rounded-xl border p-6 sticky top-24">
                            <h2 className="text-xl font-bold">Order Summary</h2>
                            <div className="mt-6 space-y-3">
                                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                                <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span></div>
                            </div>
                            <Separator className="my-4" />
                            <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div>
                            <Button size="lg" className="w-full mt-6" asChild>
                                <Link href="/checkout">Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
