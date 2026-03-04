import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useVerifyOTPMutation } from "@/redux-store/apis_action/user";
import { ArrowLeft } from "lucide-react";

export default function VerifyOTP() {
    const [otp, setOtp] = useState("");
    const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams?.get("email");

    if (!email) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="text-center space-y-4">
                    <p>No email found. Please start over.</p>
                    <Button onClick={() => router.push("/forgot-password")}>Go Back</Button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) return (toast as any).error("Please enter a 6-digit OTP");

        try {
            await verifyOTP({ email, otp }).unwrap();
            (toast as any).success("OTP verified!");
            router.push(`/reset-password?email=${email}&otp=${otp}`);
        } catch (err: any) {
            (toast as any).error(err?.data?.message || "Invalid or expired OTP");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl border shadow-sm">
                <div>
                    <Link href="/forgot-password" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Link>
                    <h2 className="text-3xl font-bold">Verify OTP</h2>
                    <p className="mt-2 text-muted-foreground">
                        We've sent a 6-digit code to <strong>{email}</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="otp">One-Time Password</Label>
                        <Input
                            id="otp"
                            type="text"
                            placeholder="123456"
                            maxLength={6}
                            className="text-center text-2xl tracking-[0.5em] font-mono"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify OTP"}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}
