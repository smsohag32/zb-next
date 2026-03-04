"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Mail, Phone, Lock, Eye, Share2, UserCheck, Bell, ArrowRight } from "lucide-react";
import { useGetStoreInfoQuery } from "@/redux-store/apis_action/store";
import { Skeleton } from "@/components/ui/skeleton";

export default function PrivacyPolicy() {
    const { data: storeInfo, isLoading } = useGetStoreInfoQuery({});

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
    };

    if (isLoading) {
        return (
            <div className="bg-[#FCFCFC] min-h-screen py-12 lg:py-24">
                <div className="container max-w-5xl mx-auto px-4 space-y-12">
                    <div className="flex flex-col items-center space-y-4">
                        <Skeleton className="h-20 w-20 rounded-2xl" />
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-48 w-full rounded-[2.5rem]" />
                    <div className="grid gap-8 lg:grid-cols-2">
                        <Skeleton className="h-64 rounded-3xl" />
                        <Skeleton className="h-64 rounded-3xl" />
                    </div>
                </div>
            </div>
        );
    }

    const storeName = storeInfo?.name || "Z BAZAR BD";
    const storeEmail = storeInfo?.email || "info@zbazarbd.com";
    const storePhone = storeInfo?.phone || "+8801743649896";

    return (
        <div className="bg-[#FCFCFC] min-h-screen py-12 lg:py-24">
            <div className="container max-w-5xl mx-auto px-4">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-16"
                >
                    {/* Minimalist Professional Header */}
                    <motion.div variants={itemVariants} className="text-center space-y-6 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Data Protection
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-extrabold text-zinc-900 tracking-tight text-balance text-shadow-sm">
                            Privacy Policy
                        </h1>
                        <p className="text-zinc-500 text-lg leading-relaxed">
                            At <span className="text-primary font-bold">{storeName}</span>, we are committed to protecting the privacy and security of your personal information. This policy outlines our standards for handling your data.
                        </p>
                        <div className="flex items-center justify-center gap-4 pt-2">
                            <div className="h-px w-8 bg-zinc-200"></div>
                            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-[0.2em]">Effective February 2026</span>
                            <div className="h-px w-8 bg-zinc-200"></div>
                        </div>
                    </motion.div>

                    {/* Introduction Card */}
                    <motion.section variants={itemVariants} className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-zinc-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        <p className="text-lg lg:text-xl text-zinc-700 leading-relaxed font-medium relative z-10 italic">
                            "This Privacy Policy describes how we collect, use, disclose, and protect the personal information we obtain from and about individuals who visit our website and use our services."
                        </p>
                    </motion.section>

                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                        {/* Collection Table */}
                        <motion.section variants={itemVariants} className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
                                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                                    <Eye className="h-5 w-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Information Collection</h2>
                            </div>
                            <div className="grid gap-4">
                                <div className="bg-white p-6 rounded-2xl border border-zinc-100 hover:border-primary/20 hover:bg-primary/[0.02] transition-all shadow-sm">
                                    <h3 className="font-bold text-primary text-sm mb-2 uppercase tracking-wide">Usage Information</h3>
                                    <p className="text-sm text-zinc-500 leading-relaxed">
                                        Interactions with our platform: pages visited, products viewed, IP address, and browser analytics to optimize your journey.
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-zinc-100 hover:border-primary/20 hover:bg-primary/[0.02] transition-all shadow-sm">
                                    <h3 className="font-bold text-primary text-sm mb-2 uppercase tracking-wide">Personal Information</h3>
                                    <p className="text-sm text-zinc-500 leading-relaxed">
                                        Required details for fulfillment: name, email, phone number, shipping address, and payment information.
                                    </p>
                                </div>
                            </div>
                        </motion.section>

                        {/* Usage Table */}
                        <motion.section variants={itemVariants} className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
                                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">How We Use Data</h2>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { title: "Marketing & Offers", desc: "Tailored promotions with your explicit consent." },
                                    { title: "Order Fulfillment", desc: "Processing, shipping, and dedicated support." },
                                    { title: "Service Optimization", desc: "Analyzing data to improve the shopping experience." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 items-center group">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="font-bold text-zinc-800 text-sm">{item.title}</h4>
                                            <p className="text-xs text-zinc-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    </div>

                    {/* Core Principles Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                title: "Transparency",
                                icon: Share2,
                                text: "We only share data with service providers or for legal compliance."
                            },
                            {
                                title: "Strict Security",
                                icon: ShieldCheck,
                                text: "We implement rigorous measures to prevent unauthorized data access."
                            },
                            {
                                title: "User Rights",
                                icon: UserCheck,
                                text: "You have full control to access, update, or correct your personal data."
                            }
                        ].map((card, idx) => (
                            <motion.div key={idx} variants={itemVariants} className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                                <card.icon className="h-6 w-6 text-primary mb-6" />
                                <h3 className="text-lg font-bold text-zinc-900 mb-2">{card.title}</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed">{card.text}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Interaction Block */}
                    <motion.section variants={itemVariants} className="bg-primary/5 border border-primary/10 p-10 lg:p-16 rounded-[3rem] text-center space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-zinc-900 group">Questions or Concerns?</h2>
                            <p className="text-zinc-500 max-w-lg mx-auto">
                                If you have any questions about this Privacy Policy or our practices, our team is ready to assist you.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                            <a href={`mailto:${storeEmail}`} className="flex items-center gap-4 text-primary hover:text-white transition-all font-bold tracking-tight px-8 py-4 bg-white hover:bg-primary rounded-2xl border border-primary/20 shadow-sm group">
                                <Mail className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                                {storeEmail}
                            </a>
                            <a href={`tel:${storePhone}`} className="flex items-center gap-4 text-primary hover:text-white transition-all font-bold tracking-tight px-8 py-4 bg-white hover:bg-primary rounded-2xl border border-primary/20 shadow-sm group">
                                <Phone className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                                {storePhone}
                            </a>
                        </div>
                    </motion.section>

                    <motion.div variants={itemVariants} className="pt-12 text-center text-zinc-400 font-bold uppercase tracking-[0.3em] text-xs">
                        Thank You For Choosing {storeName}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
