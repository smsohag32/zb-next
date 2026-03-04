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
import Logo from "@/assets/Logo";
import Image from "next/image";
import registerSneaker from "@/assets/register-sneaker.png";

const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

interface RegisterFormData {
    name: string; phone: string; email: string; password: string; agreeTerms: boolean;
}

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, control, formState: { errors, isValid }, watch } = useForm<RegisterFormData>({
        mode: "onChange",
        defaultValues: { name: "", phone: "", email: "", password: "", agreeTerms: false },
    });

    const agreeTerms = watch("agreeTerms");

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/auth/register`, {
                name: data.name, email: data.email, password: data.password, phone: data.phone,
            });
            if (response.status === 201) {
                toast.success("Registered successfully");
                router.push("/login");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to register");
        } finally { setIsLoading(false); }
    };

    return (
        <div className="min-h-screen flex w-full">
            <div className="hidden lg:flex lg:flex-1 relative bg-muted items-center justify-center overflow-hidden">
                <motion.div className="w-4/5 h-4/5 relative" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                    <Image src={registerSneaker} alt="Shop at ZBazar" fill className="object-contain" />
                </motion.div>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </div>
            <div className="flex-1 flex flex-col justify-center py-12 px-8 lg:px-16">
                <div className="max-w-md mx-auto w-full">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Link href="/"><Logo className="max-w-[180px]" /></Link>
                        <h1 className="mt-6 text-2xl font-bold">Create an account</h1>
                        <p className="mt-2 text-muted-foreground">Join us for exclusive offers and updates</p>
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="Enter name" {...register("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 chars" } })} className={errors.name ? "border-red-500" : ""} />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" placeholder="01xxxxxxxxx" {...register("phone", { required: "Phone required", pattern: { value: BD_PHONE_REGEX, message: "Valid BD phone required" } })} className={errors.phone ? "border-red-500" : ""} />
                                    {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="you@example.com" {...register("email", { required: "Email required", pattern: { value: EMAIL_REGEX, message: "Valid email required" } })} className={errors.email ? "border-red-500" : ""} />
                                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" {...register("password", { required: "Password required", minLength: { value: 8, message: "Min 8 chars" } })} className={errors.password ? "border-red-500" : ""} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password ? <p className="text-sm text-red-500">{errors.password.message}</p> : <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>}
                            </div>
                            <div className="flex items-start gap-3">
                                <Controller name="agreeTerms" control={control} render={({ field }) => <Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange} />} />
                                <Label htmlFor="terms" className="text-sm leading-relaxed">
                                    I agree to the <Link href="/terms-conditions" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
                                </Label>
                            </div>
                            <Button type="submit" size="lg" className="w-full" disabled={!isValid || isLoading}>{isLoading ? "Creating Account..." : "Create Account"}</Button>
                        </form>
                        <p className="mt-8 text-center text-sm text-muted-foreground">Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link></p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
