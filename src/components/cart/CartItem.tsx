"use client";

import Link from "next/link";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { getImageUrl } from "@/lib/getImage";
import { cn } from "@/lib/utils";
import { CartItem as CartItemType } from "@/types/product";

interface CartItemProps {
    item: CartItemType;
    updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
    updateItemOptions: (
        productId: string,
        oldSize: string,
        oldColor: string,
        newSize: string,
        newColor: string
    ) => void;
    removeItem: (productId: string, size: string, color: string) => void;
    closeCart?: () => void;
    compact?: boolean;
}

export function CartItem({
    item,
    updateQuantity,
    updateItemOptions,
    removeItem,
    closeCart,
    compact = false,
}: CartItemProps) {
    const { product, size, color, quantity } = item;
    const sizes = product.sizes || [];
    const colors = product.colors || [];

    const isAvailable = (sizeToCheck: string) => {
        const s = sizes.find(s => s.size === sizeToCheck);
        return (s?.quantity || 0) > 0;
    };

    return (
        <div className={cn(
            "group relative flex gap-4 rounded-2xl border bg-card p-4 transition-all duration-300 hover:shadow-md",
            compact ? "p-2 gap-3 border-transparent bg-transparent hover:shadow-none" : "shadow-sm"
        )}>
            {/* Image */}
            <Link
                href={`/products/${product.slug}`}
                onClick={closeCart}
                className="shrink-0 overflow-hidden rounded-xl border bg-muted/20"
            >
                <img
                    src={getImageUrl(product.images[0])}
                    alt={product.name}
                    className={cn(
                        "object-cover transition-transform duration-500 group-hover:scale-105",
                        compact ? "h-20 w-20" : "h-36 w-28 md:h-40 md:w-32"
                    )}
                />
            </Link>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between py-1 min-w-0">
                <div className="space-y-1.5 font-display">
                    <div className="flex justify-between items-start gap-2">
                        <Link
                            href={`/products/${product.slug}`}
                            onClick={closeCart}
                            className="group/link min-w-0"
                        >
                            <h3 className={cn("font-medium transition-colors group-hover/link:text-primary leading-tight", compact ? "text-sm" : "text-base md:text-lg")}>
                                {product.name}
                            </h3>
                        </Link>
                        {!compact && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 -mt-1 -mr-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                onClick={() => removeItem(product.id, size, color)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Compact View: Text-based details */}
                    {compact && (
                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            {(color || size) && (
                                <div className="flex items-center gap-1.5">
                                    {color && <span>{color}</span>}
                                    {color && size && <span className="text-muted-foreground/30">|</span>}
                                    {size && <span>{size}</span>}
                                </div>
                            )}
                        </div>
                    )}


                    {/* Full View: Selectors */}
                    {!compact && (
                        <div className="space-y-4 pt-2">
                            {/* Colors */}
                            {colors.length > 0 && (
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-12">Color</span>
                                    <div className="flex gap-2">
                                        {colors.map((c) => (
                                            <button
                                                key={c.name}
                                                onClick={() => updateItemOptions(product.id, size, color, size, c.name)}
                                                className={cn(
                                                    "relative h-6 w-6 rounded-full border border-border transition-all duration-300 hover:scale-110",
                                                    item.color === c.name && "ring-2 ring-primary ring-offset-2 scale-110 shadow-sm"
                                                )}
                                                style={{ backgroundColor: c.hex }}
                                                title={c.name}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sizes */}
                            {sizes.length > 0 && (
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-12">Size</span>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map((s) => (
                                            <button
                                                key={s.size}
                                                onClick={() => updateItemOptions(product.id, size, color, s.size || "", color)}
                                                disabled={!s.size || !isAvailable(s.size)} // Use availability check
                                                className={cn(
                                                    "h-8 min-w-[2.5rem] rounded-lg text-xs font-bold border transition-all duration-300",
                                                    item.size === s.size
                                                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                        : "bg-background text-foreground border-input hover:border-primary/50 hover:bg-primary/5",
                                                    (!s.size || !isAvailable(s.size)) && "opacity-30 cursor-not-allowed line-through"
                                                )}
                                            >
                                                {s.size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer: Qty + Price */}
                <div className="flex items-center justify-between pt-4 mt-auto">
                    <div className="flex items-center gap-1 bg-secondary/50 rounded-xl p-1 border border-border/50">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-background hover:text-foreground shadow-none transition-all active:scale-90"
                            disabled={quantity <= 1}
                            onClick={() => updateQuantity(product.id, size, color, quantity - 1)}
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-10 text-center text-sm font-bold tabular-nums">
                            {quantity}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-background hover:text-foreground shadow-none transition-all active:scale-90"
                            disabled={
                                sizes.find((s) => s.size === size)?.quantity === quantity
                            }
                            onClick={() => updateQuantity(product.id, size, color, quantity + 1)}
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    <div className="text-right">
                        <div className="text-lg md:text-xl font-bold tabular-nums text-primary tracking-tight">
                            {formatCurrency(product.price * quantity)}
                        </div>
                        {compact && (
                            <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                {formatCurrency(product.price)} ea
                            </div>
                        )}
                    </div>
                </div>
                {/* Compact Remove */}
                {compact && (
                    <div className="absolute top-1 right-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 bg-background/50 backdrop-blur-sm shadow-sm"
                            onClick={() => removeItem(product.id, size, color)}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
