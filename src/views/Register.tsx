"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store";
import Logo from "@/assets/Logo";
import registerSneaker from "@/assets/register-sneaker.png";

// Bangladeshi phone number regex: starts with 01, followed by 3-9, then 8 more digits
const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

interface RegisterFormData {
   name: string;
   phone: string;
   email: string;
   password: string;
   agreeTerms: boolean;
}

export default function RegisterPage() {
   const [showPassword, setShowPassword] = useState(false);
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);

   // Get store data from Redux
   const { storeData } = useSelector((state: RootState) => state.store);

   const {
      register,
      handleSubmit,
      control,
      formState: { errors, isValid },
      watch,
   } = useForm<RegisterFormData>({
      mode: "onChange",
      defaultValues: {
         name: "",
         phone: "",
         email: "",
         password: "",
         agreeTerms: false,
      },
   });

   const agreeTerms = watch("agreeTerms");

   const onSubmit = async (data: RegisterFormData) => {
      setIsLoading(true);
      try {
         const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/auth/register`,
            {
               name: data.name,
               email: data.email,
               password: data.password,
               phone: data.phone,
            },
         );
         if (response.status === 201) {
            toast.success("Registered successfully");
            router.push("/login");
         }
      } catch (error: any) {
         console.log(error);
         toast.error(error?.response?.data?.message || "Failed to register");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-screen flex">
         {/* Left side - Image */}
         <div className="hidden lg:flex lg:flex-1 relative bg-muted items-center justify-center overflow-hidden">
            <motion.img
               src={(registerSneaker as any).src || registerSneaker}
               alt="Professional Sneakers"
               className="w-4/5 h-4/5 object-contain"
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
         </div>

         {/* Right side - Form */}
         <div className="flex-1 flex flex-col justify-center py-12 px-8 lg:px-16">
            <div className="max-w-md mx-auto w-full">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}>
                  <Link
                     href="/"
                     className="text-3xl font-bold text-primary">
                     <Logo className="max-w-[180px]" />
                  </Link>
                  <h1 className="mt-6 text-2xl font-bold">Create an account</h1>
                  <p className="mt-2 text-muted-foreground">
                     Join us for exclusive offers and updates
                  </p>

                  <form
                     onSubmit={handleSubmit(onSubmit)}
                     className="mt-8 space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="space-y-2">
                           <Label htmlFor="name">Name</Label>
                           <Input
                              id="name"
                              placeholder="Enter name"
                              {...register("name", {
                                 required: "Name is required",
                                 minLength: {
                                    value: 2,
                                    message: "Name must be at least 2 characters",
                                 },
                              })}
                              className={
                                 errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                              }
                           />
                           {errors.name && (
                              <p className="text-sm text-red-500">{errors.name.message}</p>
                           )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                           <Label htmlFor="phone">Phone</Label>
                           <Input
                              id="phone"
                              placeholder="01xxxxxxxxx"
                              {...register("phone", {
                                 required: "Phone number is required",
                                 pattern: {
                                    value: BD_PHONE_REGEX,
                                    message: "Enter a valid BD phone (01XXXXXXXXX)",
                                 },
                              })}
                              className={
                                 errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""
                              }
                           />
                           {errors.phone && (
                              <p className="text-sm text-red-500">{errors.phone.message}</p>
                           )}
                        </div>
                     </div>

                     {/* Email */}
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                           id="email"
                           type="email"
                           placeholder="you@example.com"
                           {...register("email", {
                              required: "Email is required",
                              pattern: {
                                 value: EMAIL_REGEX,
                                 message: "Enter a valid email address",
                              },
                           })}
                           className={
                              errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                           }
                        />
                        {errors.email && (
                           <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                     </div>

                     {/* Password */}
                     <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                           <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              {...register("password", {
                                 required: "Password is required",
                                 minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters",
                                 },
                              })}
                              className={
                                 errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
                              }
                           />
                           <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                              {showPassword ? (
                                 <EyeOff className="h-4 w-4" />
                              ) : (
                                 <Eye className="h-4 w-4" />
                              )}
                           </button>
                        </div>
                        {errors.password ? (
                           <p className="text-sm text-red-500">{errors.password.message}</p>
                        ) : (
                           <p className="text-xs text-muted-foreground">
                              Must be at least 8 characters
                           </p>
                        )}
                     </div>

                     {/* Terms */}
                     <div className="flex items-start gap-3">
                        <Controller
                           name="agreeTerms"
                           control={control}
                           render={({ field }) => (
                              <Checkbox
                                 id="terms"
                                 checked={field.value}
                                 onCheckedChange={field.onChange}
                              />
                           )}
                        />
                        <Label
                           htmlFor="terms"
                           className="text-sm leading-relaxed">
                           I agree to the{" "}
                           <Link
                              href="/terms"
                              className="text-primary hover:underline">
                              Terms of Service
                           </Link>{" "}
                           and{" "}
                           <Link
                              href="/privacy"
                              className="text-primary hover:underline">
                              Privacy Policy
                           </Link>
                        </Label>
                     </div>

                     <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={!isValid || isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                     </Button>
                  </form>

                  <p className="mt-8 text-center text-sm text-muted-foreground">
                     Already have an account?{" "}
                     <Link
                        href="/login"
                        className="text-primary hover:underline">
                        Sign in
                     </Link>
                  </p>
               </motion.div>
            </div>
         </div>
      </div>
   );
}
