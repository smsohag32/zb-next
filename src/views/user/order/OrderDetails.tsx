"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
   ArrowLeft,
   Package,
   Truck,
   CheckCircle,
   Clock,
   MapPin,
   CreditCard,
   Copy,
   Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { formatCurrency, formatDate } from "@/lib/formatters";
import { toast } from "@/hooks/use-toast";
import { useGetOrderByIdQuery } from "@/redux-store/apis_action/order";
import { OrderStatus } from "@/types/order";
import { getImageUrl } from "@/lib/getImage";
import OrderDetailSkeleton from "@/components/order/OrderDetailSkeleton";
import { generateInvoice } from "@/lib/generatePdf";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store";

const statusSteps = ["pending", "processing", "shipped", "delivered"] as const;

const statusColors: Record<OrderStatus, string> = {
   pending: "bg-muted text-muted-foreground",
   processing: "bg-warning/10 text-warning",
   shipped: "bg-accent/10 text-accent",
   delivered: "bg-success/10 text-success",
   cancelled: "bg-destructive/10 text-destructive",
   returned: "bg-warning/10 text-warning",
};

export default function OrderDetailPage() {
   const params = useParams();
   const orderId = params?.orderId as string;
   const { data, isLoading } = useGetOrderByIdQuery(orderId || "", { skip: !orderId });
   const { storeData } = useSelector((state: RootState) => state.store);
   const order = data;

   if (isLoading) {
      return <OrderDetailSkeleton />;
   }
   if (!order) {
      return (
         <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Order not found</h2>
            <Button asChild>
               <Link href="/">Back to Home</Link>
            </Button>
         </div>
      );
   }

   const currentStepIndex = statusSteps.indexOf(order.status as (typeof statusSteps)[number]);

   const copyTrackingNumber = () => {
      if (order.trackingNumber) {
         navigator.clipboard.writeText(order.trackingNumber);
         toast({
            title: "Copied!",
            description: "Tracking number copied to clipboard.",
         });
      }
   };

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="space-y-6 max-w-5xl border lg:px-8 rounded-sm  px-5  mx-auto py-12 my-14 lg:py-12">
         {/* Header */}
         <div className="flex items-center gap-4">
            <Button
               variant="default"
               size="icon"
               asChild>
               <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
               </Link>
            </Button>
            <div className="flex-1">
               <h2 className="text-xl  font-semibold">{order.orderNumber}</h2>
               <p className="text-sm text-muted-foreground">
                  Placed on {formatDate(order.createdAt)}
               </p>
            </div>
            <Badge className={statusColors[order.status as OrderStatus]}>
               {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
         </div>

         {/* Order Progress */}
         {order.status !== "cancelled" && order.status !== "returned" && (
            <div className="bg-card rounded-lg p-6">
               <h3 className="font-semibold mb-6">Order Status</h3>
               <div className="relative">
                  {/* Progress line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
                  <div
                     className="absolute top-5 left-0 h-0.5 bg-accent transition-all duration-500"
                     style={{
                        width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                     }}
                  />

                  {/* Steps */}
                  <div className="relative flex justify-between">
                     {statusSteps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        const Icon =
                           step === "pending"
                              ? Clock
                              : step === "processing"
                                 ? Package
                                 : step === "shipped"
                                    ? Truck
                                    : CheckCircle;

                        return (
                           <div
                              key={step}
                              className="flex flex-col items-center text-center">
                              <div
                                 className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted
                                    ? "bg-accent text-accent-foreground"
                                    : "bg-muted text-muted-foreground"
                                    } ${isCurrent ? "ring-4 ring-accent/20" : ""}`}>
                                 <Icon className="h-5 w-5" />
                              </div>
                              <span
                                 className={`mt-2 text-sm capitalize ${isCompleted ? "font-medium" : "text-muted-foreground"
                                    }`}>
                                 {step}
                              </span>
                           </div>
                        );
                     })}
                  </div>
               </div>

               {/* Tracking Info */}
               {order.trackingNumber && (
                  <div className="mt-6 pt-6 border-t border-border">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm text-muted-foreground">Tracking Number</p>
                           <p className="font-mono">{order.trackingNumber}</p>
                        </div>
                        <Button
                           variant="ghost"
                           size="icon"
                           onClick={copyTrackingNumber}>
                           <Copy className="h-4 w-4" />
                        </Button>
                     </div>
                     {order.estimatedDelivery && (
                        <p className="text-sm text-muted-foreground mt-2">
                           Estimated delivery:{" "}
                           <span className="text-foreground">
                              {formatDate(order.estimatedDelivery)}
                           </span>
                        </p>
                     )}
                  </div>
               )}
            </div>
         )}

         {/* Order Items */}
         <div className="bg-card rounded-lg p-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
               {order?.items?.map((item: any, index: number) => (
                  <div
                     key={index}
                     className="flex gap-4">
                     <Link href={`/products/${item.product.slug}`}>
                        <img
                           src={getImageUrl(item.product?.productImages[0]?.url)}
                           alt={item.product.name}
                           className="w-20 h-24 object-cover rounded-md"
                        />
                     </Link>
                     <div className="flex-1 min-w-0">
                        <Link
                           href={`/products/${item.product.slug}`}
                           className="font-medium hover:text-accent transition-colors">
                           {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                           {item.size && <span>Size: {item.size}</span>}
                           {item.color && <span>Color: {item.color}</span>}
                        </div>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                     </div>
                     <span className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                     </span>
                  </div>
               ))}
            </div>
         </div>

         {/* Order Details */}
         <div className="grid md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div className="bg-card rounded-lg p-6">
               <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Shipping Address</h3>
               </div>
               <address className="not-italic text-sm text-muted-foreground space-y-1">
                  <p className="text-foreground font-medium">
                     {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                  <p>
                     {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                     {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p>{order.shippingAddress.phone}</p>
               </address>
            </div>

            {/* Payment Info */}
            <div className="bg-card rounded-lg p-6">
               <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Payment Method</h3>
               </div>
               <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>

               <Separator className="my-4" />

               <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                     <span className="text-muted-foreground">Subtotal</span>
                     <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-muted-foreground">Shipping</span>
                     <span>{order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-muted-foreground">Tax</span>
                     <span>{formatCurrency(order.tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-base">
                     <span>Total</span>
                     <span>{formatCurrency(order.total)}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Actions */}
         <div className="flex justify-end gap-4">
            {order.status === "delivered" && <Button variant="outline">Request Return</Button>}
            <Button
               variant="default"
               onClick={() => generateInvoice(order, storeData)}>
               <Download /> Download Invoice
            </Button>
         </div>
      </motion.div>
   );
}
