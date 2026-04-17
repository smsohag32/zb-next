"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux-store";
import { toast } from "sonner";
import { loginUser } from "@/redux-store/slices/authSlice";
import Logo from "@/assets/Logo";
import Image from "next/image";
import loginSneaker from "@/assets/login-sneaker.png";
import type { Metadata } from "next";

export default function LoginPage() {
   const [showPassword, setShowPassword] = useState(false);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const router = useRouter();
   const dispatch = useDispatch<AppDispatch>();
   const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         const res = await dispatch(loginUser({ email, password })).unwrap();
         if (res.status !== 200) throw new Error(res.message || "Login failed");
         toast.success("Login successful!");
         router.replace("/dashboard");
      } catch (error: any) {
         toast.error(error?.message || "Login failed");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className=" py-8 flex w-full">
         {/* Left side - Form */}
         <div className="flex-1 flex flex-col py-8 justify-center px-8 lg:px-16">
            <div className="max-w-md mx-auto w-full">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}>
                  <h1 className="mt-6 text-2xl font-bold">Login</h1>

                  <form
                     onSubmit={handleSubmit}
                     className="mt-8 space-y-6">
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                           id="email"
                           type="email"
                           placeholder="you@example.com"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <Label htmlFor="password">Password</Label>
                           <Link
                              href="/forgot-password"
                              className="text-sm text-primary hover:underline">
                              Forgot password?
                           </Link>
                        </div>
                        <div className="relative">
                           <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
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
                     </div>
                     <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Sign In"}
                     </Button>
                  </form>

                  <p className="mt-8 text-center text-sm text-muted-foreground">
                     Don&apos;t have an account?{" "}
                     <Link
                        href="/register"
                        className="text-primary hover:underline">
                        Sign up
                     </Link>
                  </p>
               </motion.div>
            </div>
         </div>

         {/* Right side - Image */}
         <div className="hidden lg:flex lg:flex-1 relative  items-center justify-center overflow-hidden">
            <motion.div
               className="w-4/5 h-4/5 relative"
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 0.8, ease: "easeOut" }}>
               <Image
                  src={loginSneaker}
                  alt="Shop at ZBazar"
                  className="object-contain"
                  fill
               />
            </motion.div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
         </div>
      </div>
   );
}
