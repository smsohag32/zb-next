"use client";

import { motion } from "framer-motion";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hook/useAuth";
import { useGetUserAddressQuery } from "@/redux-store/apis_action/user";

export default function AddressesPage() {
   const { user } = useAuth();
   const { data, isLoading, isError } = useGetUserAddressQuery(user?.id, { skip: !user });
   const addresses = data?.data || [];

   if (!user) {
      return (
         <div className="text-center py-16 text-muted-foreground">
            Please login to manage your addresses.
         </div>
      );
   }

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-xl font-semibold mb-2">Saved Addresses</h2>
               <p className="text-muted-foreground">Manage your shipping and billing addresses</p>
            </div>
            <Button>
               <Plus className="h-4 w-4 mr-2" />
               Add Address
            </Button>
         </div>

         {/* Loading */}
         {isLoading && (
            <div className="text-center py-16 text-muted-foreground">Loading addresses...</div>
         )}

         {/* Error */}
         {isError && (
            <div className="text-center py-16 text-destructive">
               Failed to load addresses. Please try again.
            </div>
         )}

         {/* Empty */}
         {!isLoading && addresses?.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">No saved addresses found.</div>
         )}

         {/* Address List */}
         <div className="grid md:grid-cols-2 gap-4">
            {addresses?.map((address: any) => (
               <div
                  key={address.id}
                  className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                     <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium capitalize">{address.type}</span>
                        {address.isDefault && <Badge variant="secondary">Default</Badge>}
                     </div>
                     <div className="flex gap-1">
                        <Button
                           variant="ghost"
                           size="icon">
                           <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                           variant="ghost"
                           size="icon"
                           className="text-destructive">
                           <Trash2 className="h-4 w-4" />
                        </Button>
                     </div>
                  </div>
                  <address className="not-italic text-sm text-muted-foreground space-y-1">
                     <p className="text-foreground">
                        {address.firstName} {address.lastName}
                     </p>
                     <p>{address.address1}</p>
                     <p>
                        {[address.city, address.state, address.postalCode].filter(Boolean).join(", ")}
                     </p>
                     <p>{address.phone}</p>
                  </address>
               </div>
            ))}
         </div>
      </motion.div>
   );
}
