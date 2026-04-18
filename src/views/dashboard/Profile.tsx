"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hook/useAuth";
import { getImageUrl } from "@/lib/getImage";
import {
   useUpdateProfileImageMutation,
   useUpdateProfileMutation,
   useGetUserStatsQuery,
} from "@/redux-store/apis_action/user";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux-store";
import { setUpdatedUserInfo } from "@/redux-store/slices/authSlice";
import { displayErrors } from "@/utils/error";
import { profileSchema, ProfileFormValues } from "@/schemas/profileSchema";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Loader2, Camera } from "lucide-react";
import { Seo } from "@/seo/Seo";

export default function ProfilePage() {
   const { user } = useAuth();
   const dispatch = useDispatch<AppDispatch>();
   const { items: wishlistItems } = useWishlistStore();

   // Redux store data for SEO
   const { storeData } = useSelector((state: RootState) => state.store);
   const storeName = storeData?.name || "ZBazar";

   // API Hooks
   const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
   const [updateProfileImage, { isLoading: isUploading }] = useUpdateProfileImageMutation();
   const { data: statsData, isLoading: isStatsLoading } = useGetUserStatsQuery(user?.id, {
      skip: !user?.id,
   });

   const [preview, setPreview] = useState<string | null>(null);

   // Form Initialization
   const form = useForm<ProfileFormValues>({
      resolver: zodResolver(profileSchema),
      defaultValues: {
         name: "",
         email: "",
         phone: "",
      },
   });

   // Sync user data with form
   useEffect(() => {
      if (user) {
         form.reset({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
         });
         setPreview(user.image ? getImageUrl(user.image) : null);
      }
   }, [user, form]);

   // Handle Photo Upload
   const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setPreview(URL.createObjectURL(file));

      try {
         const formData = new FormData();
         formData.append("image", file);

         const res = await updateProfileImage({ id: user?.id, formData }).unwrap();

         const userInfo = res?.data?.user || res?.data;

         if (userInfo) {
            dispatch(setUpdatedUserInfo(userInfo));
            toast.success("Profile photo updated successfully!");
         }
      } catch (error) {
         console.error(error);
         toast.error("Error uploading photo");
         setPreview(user?.image ? getImageUrl(user.image) : null);
      }
   };

   // Handle Profile Update
   const onSubmit = async (values: ProfileFormValues) => {
      try {
         const res = await updateProfile({ id: user?.id, ...values }).unwrap();
         const userInfo = res?.data;

         if (userInfo) {
            dispatch(setUpdatedUserInfo(userInfo));
            toast.success("Profile updated successfully!");
         }
      } catch (error) {
         displayErrors(error);
      }
   };

   return (
      <>
         {/* SEO */}
         <Seo
            storeData={{
               metaTitle: `${user?.name || "User"} Profile | ${storeName}`,
               metaDescription: `Manage your profile, update personal details and view account statistics on ${storeName}.`,
               metaTags: ["profile", "user", "account", storeName],
            }}
         />

         <div className="space-y-6 max-w-4xl mx-auto pb-10">
            {/* Profile Information Card */}
            <Card className="border-border/60 shadow-sm">
               <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details below.</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="flex flex-col md:flex-row gap-8">
                     {/* Photo Section */}
                     <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                           <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                              {preview ? (
                                 <AvatarImage
                                    src={preview}
                                    className="object-cover"
                                 />
                              ) : (
                                 <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                                    {user?.name?.slice(0, 2).toUpperCase()}
                                 </AvatarFallback>
                              )}
                           </Avatar>
                           <Label
                              htmlFor="upimage"
                              className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:bg-primary/90 transition-colors">
                              {isUploading ? (
                                 <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                 <Camera className="h-4 w-4" />
                              )}
                           </Label>
                           <input
                              type="file"
                              id="upimage"
                              accept="image/*"
                              className="hidden"
                              onChange={handlePhotoChange}
                              disabled={isUploading}
                           />
                        </div>
                        <p className="text-xs text-muted-foreground text-center max-w-[150px]">
                           Allowed *.jpeg, *.jpg, *.png, *.gif max size of 2MB
                        </p>
                     </div>

                     {/* Form Section */}
                     <div className="flex-1">
                        <Form {...form}>
                           <form
                              onSubmit={form.handleSubmit(onSubmit)}
                              className="space-y-4">
                              <div className="grid gap-4 sm:grid-cols-2">
                                 <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel>Full Name</FormLabel>
                                          <FormControl>
                                             <Input
                                                placeholder="John Doe"
                                                {...field}
                                             />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                                 <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel>Phone Number</FormLabel>
                                          <FormControl>
                                             <Input
                                                type="tel"
                                                placeholder="+880..."
                                                {...field}
                                             />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                              </div>

                              <FormField
                                 control={form.control}
                                 name="email"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel>Email Address</FormLabel>
                                       <FormControl>
                                          <Input
                                             type="email"
                                             placeholder="john@example.com"
                                             {...field}
                                          />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              <div className="flex justify-end pt-4">
                                 <Button
                                    type="submit"
                                    disabled={isUpdating}>
                                    {isUpdating && (
                                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                 </Button>
                              </div>
                           </form>
                        </Form>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Account Statistics Card */}
            <Card className="border-border/60 shadow-sm">
               <CardHeader>
                  <CardTitle>Account Statistics</CardTitle>
                  <CardDescription>Overview of your activity on {storeName}</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                     <StatCard
                        label="Total Orders"
                        value={statsData?.data?.totalOrders || 0}
                        loading={isStatsLoading}
                     />
                     <StatCard
                        label="Wishlist Items"
                        value={wishlistItems.length}
                        loading={false}
                     />
                     <StatCard
                        label="Reviews Given"
                        value={statsData?.data?.totalReviews || 0}
                        loading={isStatsLoading}
                     />
                  </div>
               </CardContent>
            </Card>
         </div>
      </>
   );
}

function StatCard({ label, value, loading }: { label: string; value: number; loading: boolean }) {
   return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-secondary/30 p-6 border border-border/50 hover:bg-secondary/50 transition-colors">
         {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
         ) : (
            <p className="text-3xl font-bold text-primary">{value}</p>
         )}
         <p className="text-sm font-medium text-muted-foreground mt-2">{label}</p>
      </div>
   );
}
