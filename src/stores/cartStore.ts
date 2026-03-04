import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types/product";

interface CartState {
   items: CartItem[];
   isOpen: boolean;
   addItem: (product: Product, size: string, color: string, quantity?: number) => void;
   removeItem: (productId: string, size: string, color: string) => void;
   updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
   updateItemOptions: (
      productId: string,
      oldSize: string,
      oldColor: string,
      newSize: string,
      newColor: string
   ) => void;
   clearCart: () => void;
   openCart: () => void;
   closeCart: () => void;
   toggleCart: () => void;
   getItemCount: () => number;
   getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
   persist(
      (set, get) => ({
         items: [],
         isOpen: false,

         addItem: (product, size, color, quantity = 1) => {
            set((state) => {
               const existingIndex = state.items.findIndex(
                  (item) =>
                     item.product.id === product.id && item.size === size && item.color === color
               );

               if (existingIndex >= 0) {
                  const newItems = [...state.items];
                  newItems[existingIndex].quantity += quantity;
                  return { items: newItems };
               }

               return {
                  items: [...state.items, { product, size, color, quantity }],
               };
            });
         },

         removeItem: (productId, size, color) => {
            set((state) => ({
               items: state.items.filter(
                  (item) =>
                     !(item.product.id === productId && item.size === size && item.color === color)
               ),
            }));
         },

         updateQuantity: (productId, size, color, quantity) => {
            set((state) => {
               if (quantity <= 0) {
                  return {
                     items: state.items.filter(
                        (item) =>
                           !(
                              item.product.id === productId &&
                              item.size === size &&
                              item.color === color
                           )
                     ),
                  };
               }

               return {
                  items: state.items.map((item) =>
                     item.product.id === productId && item.size === size && item.color === color
                        ? { ...item, quantity }
                        : item
                  ),
               };
            });
         },

         updateItemOptions: (
            productId: string,
            oldSize: string,
            oldColor: string,
            newSize?: string, // optional
            newColor?: string // optional
         ) => {
            set((state) => {
               const existingIndex = state.items.findIndex(
                  (item) =>
                     item.product.id === productId &&
                     item.size === oldSize &&
                     item.color === oldColor
               );

               if (existingIndex === -1) return state;

               const newItems = [...state.items];
               const currentItem = newItems[existingIndex];

               const updatedSize = newSize !== undefined ? newSize : currentItem.size;
               const updatedColor = newColor !== undefined ? newColor : currentItem.color;

               // Check if fully selected combination already exists
               if (updatedSize && updatedColor) {
                  const duplicateIndex = state.items.findIndex(
                     (item, idx) =>
                        idx !== existingIndex &&
                        item.product.id === productId &&
                        item.size === updatedSize &&
                        item.color === updatedColor
                  );

                  if (duplicateIndex >= 0) {
                     // Merge quantities
                     newItems[duplicateIndex].quantity += currentItem.quantity;
                     newItems.splice(existingIndex, 1); // remove old
                     return { items: newItems };
                  }
               }

               // Update size/color but keep item even if some options missing
               newItems[existingIndex] = {
                  ...currentItem,
                  size: updatedSize,
                  color: updatedColor,
               };

               return { items: newItems };
            });
         },

         clearCart: () => set({ items: [] }),

         openCart: () => set({ isOpen: true }),
         closeCart: () => set({ isOpen: false }),
         toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

         getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

         getSubtotal: () =>
            get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      }),
      {
         name: "cart-storage",
         partialize: (state) => ({ items: state.items }),
      }
   )
);
