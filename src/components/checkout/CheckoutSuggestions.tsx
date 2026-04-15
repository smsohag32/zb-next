"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Tag, Plus, Minus, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetCheckoutSuggestionsQuery } from "@/redux-store/apis_action/products";
import { useCartStore } from "@/stores/cartStore";
import { getImageUrl } from "@/lib/getImage";
import { formatCurrency } from "@/lib/formatters";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SuggestedProductsProps {
   cartItems: any[];
   onSelectionChange?: (selectedItems: any[]) => void;
}

// ── Per-product selection state ───────────────────────────────────────────────
interface Selection {
   size: string;
   color: string;
   qty: number;
}

// ── Single Row ────────────────────────────────────────────────────────────────
function ProductRow({
   product,
   checked,
   selection,
   onToggle,
   onSelectionChange,
}: {
   product: any;
   checked: boolean;
   selection: Selection;
   onToggle: () => void;
   onSelectionChange: (s: Partial<Selection>) => void;
}) {
   const router = useRouter();
   const hasSizes = (product.sizes?.length ?? 0) > 0;
   const hasColors = (product.colors?.length ?? 0) > 0;

   const sizeObj = product.sizes?.find((s: any) => s.size === selection.size);
   const maxQty = sizeObj?.quantity ?? product.stock ?? 99;

   const discount =
      product.originalPrice && product.originalPrice > product.price
         ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
         : null;

   return (
      <div
         className={cn(
            "rounded-xl border transition-all duration-200 overflow-hidden",
            checked
               ? "border-primary/50 bg-primary/[0.02] shadow-sm"
               : "border-border bg-background hover:border-primary/30",
         )}>
         {/* Main Row — always visible */}
         <div className="flex items-center gap-2.5 p-2.5">
            {/* Checkbox */}
            <Checkbox
               id={`suggest-${product.id}`}
               checked={checked}
               onCheckedChange={onToggle}
               className="flex-shrink-0"
            />

            {/* Thumbnail */}
            <div
               className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-muted cursor-pointer"
               onClick={() => router.push(`/product/${product.slug}`)}>
               <img
                  src={getImageUrl(product.images?.[0])}
                  alt={product.name}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-200"
               />
               {discount && (
                  <span className="absolute top-0.5 left-0.5 bg-rose-500 text-white text-[8px] font-bold px-0.5 py-px rounded leading-none">
                     -{discount}%
                  </span>
               )}
               {!product.inStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                     <span className="text-[8px] text-white font-semibold">Sold Out</span>
                  </div>
               )}
            </div>

            {/* Name & Price */}
            <div
               className="flex-1 min-w-0 cursor-pointer"
               onClick={() => router.push(`/product/${product.slug}`)}>
               <p className="text-[11px] font-medium line-clamp-2 leading-snug hover:text-primary transition-colors">
                  {product.name}
               </p>
               <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xs font-bold text-primary">
                     {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                     <span className="text-[10px] text-muted-foreground line-through">
                        {formatCurrency(product.originalPrice)}
                     </span>
                  )}
               </div>
            </div>
         </div>

         {/* Expanded selection — only when checked */}
         {checked && (
            <div className="px-3 pb-3 space-y-2 border-t border-primary/10 pt-2.5">
               {/* Size */}
               {hasSizes && (
                  <div className="space-y-1">
                     <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                        Size
                     </p>
                     <div className="flex flex-wrap gap-1">
                        {product.sizes.map((s: any) => {
                           const available = (s.quantity ?? 0) > 0;
                           const selected = selection.size === s.size;
                           return (
                              <button
                                 key={s.size}
                                 disabled={!available}
                                 onClick={() => available && onSelectionChange({ size: s.size })}
                                 className={cn(
                                    "h-5 min-w-[22px] px-1.5 text-[10px] font-semibold rounded border transition-all",
                                    selected
                                       ? "bg-primary text-primary-foreground border-primary"
                                       : available
                                         ? "border-border hover:border-primary/60 text-muted-foreground"
                                         : "border-dashed opacity-30 cursor-not-allowed line-through text-muted-foreground",
                                 )}>
                                 {s.size}
                              </button>
                           );
                        })}
                     </div>
                  </div>
               )}

               {/* Color */}
               {hasColors && (
                  <div className="space-y-1">
                     <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                        Color{selection.color && `: ${selection.color}`}
                     </p>
                     <div className="flex gap-1.5 flex-wrap">
                        {product.colors.map((c: any) => {
                           const selected = selection.color === c.color;
                           return (
                              <button
                                 key={c.color}
                                 title={c.color}
                                 onClick={() => onSelectionChange({ color: c.color })}
                                 className={cn(
                                    "h-4 w-4 rounded-full border-2 transition-all",
                                    selected
                                       ? "border-primary ring-1 ring-primary ring-offset-1 scale-110"
                                       : "border-transparent hover:border-muted-foreground",
                                 )}
                                 style={{ backgroundColor: c.hex }}
                              />
                           );
                        })}
                     </div>
                  </div>
               )}

               {/* Quantity */}
               <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                     Quantity
                  </p>
                  <div className="flex items-center border rounded-md h-6 overflow-hidden">
                     <button
                        onClick={() => onSelectionChange({ qty: Math.max(1, selection.qty - 1) })}
                        disabled={selection.qty <= 1}
                        className="w-6 flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors">
                        <Minus className="h-2.5 w-2.5" />
                     </button>
                     <span className="w-6 text-center text-[11px] font-semibold">
                        {selection.qty}
                     </span>
                     <button
                        onClick={() =>
                           onSelectionChange({ qty: Math.min(maxQty, selection.qty + 1) })
                        }
                        disabled={selection.qty >= maxQty}
                        className="w-6 flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors">
                        <Plus className="h-2.5 w-2.5" />
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonRow = () => (
   <div className="flex items-center gap-2.5 p-2.5 rounded-xl border animate-pulse">
      <div className="h-4 w-4 rounded bg-muted flex-shrink-0" />
      <div className="h-12 w-12 rounded-lg bg-muted flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
         <div className="h-2.5 bg-muted rounded w-4/5" />
         <div className="h-2.5 bg-muted rounded w-2/5" />
         <div className="h-3 bg-muted rounded w-1/4" />
      </div>
   </div>
);

// ── Main Export ───────────────────────────────────────────────────────────────
export default function CheckoutSuggestions({
   cartItems,
   onSelectionChange,
}: SuggestedProductsProps) {
   const { toast } = useToast();
   const { addItem } = useCartStore();

   // Collect unique tags from cart
   const allTags = useMemo(() => {
      const tags = new Set<string>();
      cartItems.forEach((item) => {
         const p = item.product ?? item;
         (p.tags ?? []).forEach((tag: string) => tags.add(tag.toLowerCase()));
      });
      return Array.from(tags);
   }, [cartItems]);

   const excludeIds = useMemo(
      () => cartItems.map((item) => (item.product ?? item).id),
      [cartItems],
   );

   const { data, isLoading, isFetching } = useGetCheckoutSuggestionsQuery(
      { tags: allTags, excludeIds, limit: 6 },
      { skip: allTags.length === 0 },
   );

   const suggestions = useMemo(() => data?.data ?? [], [data?.data]);

   // Track which products are checked + their selections
   const [checked, setChecked] = useState<Record<number, boolean>>({});
   const [selections, setSelections] = useState<Record<number, Selection>>({});

   const getSelection = (id: number): Selection =>
      selections[id] ?? { size: "", color: "", qty: 1 };

   const toggleChecked = (product: any) => {
      const id = product.id;
      const isNowChecked = !checked[id];
      setChecked((prev) => ({ ...prev, [id]: isNowChecked }));

      // Pre-fill defaults on first check
      if (isNowChecked && !selections[id]) {
         const firstAvail = product.sizes?.find((s: any) => (s.quantity ?? 0) > 0);
         setSelections((prev) => ({
            ...prev,
            [id]: {
               size: firstAvail?.size ?? product.sizes?.[0]?.size ?? "",
               color: product.colors?.[0]?.color ?? "",
               qty: 1,
            },
         }));
      }
   };

   const updateSelection = (id: number, partial: Partial<Selection>) => {
      setSelections((prev) => ({
         ...prev,
         [id]: { ...getSelection(id), ...partial },
      }));
   };

   const selectedItemsComplete = useMemo(() => {
      return suggestions
         .filter((p) => checked[p.id])
         .map((p) => ({
            product: p,
            ...getSelection(p.id),
         }));
   }, [checked, selections, suggestions]);

   // Sync selections to parent
   useEffect(() => {
      onSelectionChange?.(selectedItemsComplete);
   }, [selectedItemsComplete, onSelectionChange]);

   // Selected products for internal validation (optional display)
   const selectedItems = suggestions.filter((p) => checked[p.id]);

   const canAddAll = selectedItems.every((p) => {
      const sel = getSelection(p.id);
      const hasSizes = (p.sizes?.length ?? 0) > 0;
      const hasColors = (p.colors?.length ?? 0) > 0;
      return p.inStock && (!hasSizes || !!sel.size) && (!hasColors || !!sel.color);
   });

   const handleAddSelected = () => {
      if (!selectedItems.length || !canAddAll) return;
      selectedItems.forEach((p) => {
         const sel = getSelection(p.id);
         addItem(p, sel.size, sel.color, sel.qty);
      });
      toast({
         title: `${selectedItems.length} item${selectedItems.length > 1 ? "s" : ""} added to cart`,
         description: selectedItems.map((p) => p.name).join(", "),
      });
      // Uncheck all after adding
      setChecked({});
   };

   if (!isLoading && !isFetching && allTags.length === 0) return null;
   if (!isLoading && !isFetching && suggestions.length === 0) return null;

   return (
      <div className="rounded-xl border bg-card overflow-hidden">
         {/* Header */}
         <div className="px-4 pt-3.5 pb-3 border-b bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
               </div>
               <div>
                  <p className="text-sm font-semibold">You May Also Like</p>
                  <p className="text-[11px] text-muted-foreground">
                     Select items to add to your order
                  </p>
               </div>
            </div>
            {allTags.length > 0 && (
               <div className="hidden sm:flex gap-1 flex-wrap justify-end max-w-[140px]">
                  {allTags.slice(0, 2).map((tag) => (
                     <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[10px] h-5 px-1.5 gap-1 capitalize">
                        <Tag className="h-2.5 w-2.5" />
                        {tag}
                     </Badge>
                  ))}
                  {allTags.length > 2 && (
                     <Badge
                        variant="outline"
                        className="text-[10px] h-5 px-1.5">
                        +{allTags.length - 2}
                     </Badge>
                  )}
               </div>
            )}
         </div>

         {/* Product list */}
         <div className="p-2.5 space-y-2">
            {isLoading || isFetching
               ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
               : suggestions.map((product) => (
                    <ProductRow
                       key={product.id}
                       product={product}
                       checked={!!checked[product.id]}
                       selection={getSelection(product.id)}
                       onToggle={() => toggleChecked(product)}
                       onSelectionChange={(partial) => updateSelection(product.id, partial)}
                    />
                 ))}
         </div>
      </div>
   );
}
