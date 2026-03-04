"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/redux-store/apis_action/user";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            setEmail(sessionStorage.getItem("otp_email") || "");
            setOtp(sessionStorage.getItem("otp_code") || "");
        }
    }, []);

    if (!email || !otp) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="text-center space-y-4">
                    <p>Unauthorized access. Please start over.</p>
                    <Button onClick={() => router.push("/forgot-password")}>Go Back</Button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) return toast.error("Password must be at least 6 characters");
        if (password !== confirmPassword) return toast.error("Passwords do not match");
        try {
            await resetPassword({ email, otp, password }).unwrap();
            toast.success("Password reset successful!");
            sessionStorage.removeItem("otp_email");
            sessionStorage.removeItem("otp_code");
            router.push("/login");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl border shadow-sm">
                <div>
                    <h2 className="text-3xl font-bold">Reset Password</h2>
                    <p className="mt-2 text-muted-foreground">Create a new strong password for your account.</p>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}
