import { CartItem } from "./product";
import { Address } from "./user";

export interface Order {
   id: string;
   orderNumber: string;
   items: CartItem[];
   shippingAddress: Address;
   billingAddress: Address;
   subtotal: number;
   shippingCost: number;
   tax: number;
   total: number;
   status: OrderStatus;
   paymentMethod: string;
   createdAt: string;
   updatedAt: string;
   estimatedDelivery?: string;
   trackingNumber?: string;
}

export type OrderStatus =
   | "pending"
   | "processing"
   | "shipped"
   | "delivered"
   | "cancelled"
   | "returned";

export interface OrderSummary {
   subtotal: number;
   shippingCost: number;
   tax: number;
   discount: number;
   total: number;
}
