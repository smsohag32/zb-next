"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ChevronRight, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { formatCurrency, formatShortDate } from "@/lib/formatters";

import { useGetUserOrdersQuery } from "@/redux-store/apis_action/order";
import { Order, OrderStatus } from "@/types/order";
import { useAuth } from "@/hook/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store";

const statusColors: Record<OrderStatus, string> = {
   pending: "bg-muted text-muted-foreground",
   processing: "bg-warning/10 text-warning",
   shipped: "bg-accent/10 text-accent",
   delivered: "bg-success/10 text-success",
   cancelled: "bg-destructive/10 text-destructive",
   returned: "bg-muted text-muted-foreground",
};

export default function OrdersPage() {
   const [searchQuery, setSearchQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState<string>("all");
   const { user } = useAuth();

   // Get store data from Redux
   const { storeData } = useSelector((state: RootState) => state.store);
   const storeName = storeData?.name || "ZBazar";

   const { data: orders = [], isLoading } = useGetUserOrdersQuery(
      { userId: user?.id },
      { skip: !user },
   );

   // Filter orders by search and status
   const filteredOrders = useMemo(() => {
      return orders?.filter((order: Order) => {
         if (statusFilter !== "all" && order.status !== statusFilter) return false;

         if (searchQuery) {
            const lowerSearch = searchQuery.toLowerCase();
            const matchesOrderNumber = order.orderNumber.toLowerCase().includes(lowerSearch);
            const matchesProduct = order.items.some((item: any) =>
               item.product.name.toLowerCase().includes(lowerSearch),
            );
            return matchesOrderNumber || matchesProduct;
         }

         return true;
      });
   }, [orders, searchQuery, statusFilter]);

   return (
      <>
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 px-5 pb-8 rounded-md">
            <div>
               <h2 className="text-2xl font-semibold mb-2">Order History</h2>
               <p className="text-muted-foreground">View and track all your orders</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                     placeholder="Search orders..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-10"
                  />
               </div>
               <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                     <Filter className="h-4 w-4 mr-2" />
                     <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">All Orders</SelectItem>
                     <SelectItem value="pending">Pending</SelectItem>
                     <SelectItem value="processing">Processing</SelectItem>
                     <SelectItem value="shipped">Shipped</SelectItem>
                     <SelectItem value="delivered">Delivered</SelectItem>
                     <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            {/* Loading */}
            {isLoading ? (
               <div className="text-center py-16 text-muted-foreground">Loading your orders...</div>
            ) : filteredOrders.length === 0 ? (
               <div className="text-center py-16">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                  <p className="text-muted-foreground mb-6">
                     {searchQuery || statusFilter !== "all"
                        ? "Try adjusting your filters"
                        : "You haven't placed any orders yet"}
                  </p>
                  <Button asChild>
                     <Link href="/products">Start Shopping</Link>
                  </Button>
               </div>
            ) : (
               <div className="space-y-4">
                  {filteredOrders.map((order: Order, index: number) => (
                     <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}>
                        <Link
                           href={`/dashboard/orders/${order.orderNumber}`}
                           className="block bg-card border border-border rounded-lg p-4 hover:shadow-elegant transition-shadow">
                           <div className="flex items-start justify-between mb-4">
                              <div>
                                 <p className="font-semibold">{order.orderNumber}</p>
                                 <p className="text-sm text-muted-foreground">
                                    Placed on {formatShortDate(order.createdAt)}
                                 </p>
                              </div>
                              <Badge className={statusColors[order.status]}>
                                 {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                           </div>

                           <div className="flex items-center gap-4">
                              <div className="flex -space-x-2">
                                 {order?.items?.slice(0, 4).map((item: any, idx: number) => (
                                    <img
                                       key={idx}
                                       src={
                                          item.product?.productImages[0]?.url
                                             ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "")}/${item?.product?.productImages[0]?.url?.replace(/^\/+/, "")}`
                                             : "/placeholder.svg"
                                       }
                                       alt={item.product.title || "Product Image"}
                                       className="w-12 h-12 rounded-md object-cover border-2 border-background"
                                    />
                                 ))}

                                 {order.items.length > 4 && (
                                    <div className="w-12 h-12 rounded-md bg-muted border-2 border-background flex items-center justify-center text-sm text-muted-foreground">
                                       +{order.items.length - 4}
                                    </div>
                                 )}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className="text-sm text-muted-foreground">
                                    {order.items.length} item{order.items.length !== 1 && "s"}
                                 </p>
                                 {order.trackingNumber && (
                                    <p className="text-xs text-muted-foreground">
                                       Tracking: {order.trackingNumber}
                                    </p>
                                 )}
                              </div>
                              <div className="flex items-center gap-2">
                                 <span className="font-semibold">
                                    {formatCurrency(order.total)}
                                 </span>
                                 <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              </div>
                           </div>
                        </Link>
                     </motion.div>
                  ))}
               </div>
            )}
         </motion.div>
      </>
   );
}
