"use client";

import { motion } from "framer-motion";
import {
    FileText,
    Truck,
    CreditCard,
    RefreshCcw,
    Info,
    ShieldAlert,
    Clock,
    MapPin,
    CheckCircle2,
    AlertCircle,
    ChevronRight
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useGetStoreInfoQuery } from "@/redux-store/apis_action/store";
import { Skeleton } from "@/components/ui/skeleton";

export default function TermsAndConditions() {
    const { data: storeInfo, isLoading } = useGetStoreInfoQuery({});

    if (isLoading) {
        return (
            <div className="bg-[#FCFCFC] min-h-screen py-12 lg:py-24">
                <div className="container max-w-4xl mx-auto px-4 space-y-12">
                    <div className="flex flex-col items-center space-y-4">
                        <Skeleton className="h-20 w-20 rounded-2xl" />
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-48 w-full rounded-[2.5rem]" />
                    <div className="space-y-4">
                        <Skeleton className="h-20 w-full rounded-2xl" />
                        <Skeleton className="h-20 w-full rounded-2xl" />
                        <Skeleton className="h-20 w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    const storeName = storeInfo?.name || "Z BAZAR BD";
    const insideDhakaCharge = storeInfo?.shipping?.inside_dhaka?.price ?? 60;
    const outsideDhakaCharge = storeInfo?.shipping?.outside_dhaka?.price ?? 120;

    return (
        <div className="bg-[#FCFCFC] min-h-screen py-12 lg:py-24">
            <div className="container max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-16"
                >
                    {/* Premium Header */}
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider">
                            <FileText className="h-3.5 w-3.5" />
                            Service Agreement
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-extrabold text-zinc-900 tracking-tight">
                            Terms & Conditions
                        </h1>
                        <p className="text-zinc-500 text-lg max-w-2xl mx-auto leading-relaxed">
                            Please read these terms carefully before placing an order. These standards ensure an exceptional shopping experience for every customer at <span className="text-primary font-bold">{storeName}</span>.
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 font-medium uppercase tracking-widest text-[10px] px-3">
                                Last Updated: February 2026
                            </Badge>
                        </div>
                    </div>

                    {/* Professional Welcome Note */}
                    <section className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-zinc-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                        <div className="flex gap-6 items-start">
                            <div className="p-3 bg-primary/10 rounded-xl border border-primary/10 shrink-0">
                                <Info className="h-6 w-6 text-primary" />
                            </div>
                            <p className="text-lg text-zinc-700 leading-relaxed font-medium italic">
                                "Welcome to {storeName}. Before proceeding with your order, we kindly ask you to understand our guidelines. These terms are designed to protect both the customer and the brand during our professional relationship."
                            </p>
                        </div>
                    </section>

                    {/* Accordion Policy Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
                            <ShieldAlert className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Our Core Policies</h2>
                        </div>

                        <Accordion type="single" collapsible className="w-full space-y-4 border-none">
                            {/* Order Policy */}
                            <AccordionItem value="order-policy" className="bg-white border border-zinc-100 rounded-[1.5rem] px-6 transition-all data-[state=open]:shadow-md data-[state=open]:border-primary/20">
                                <AccordionTrigger className="hover:no-underline py-6 group">
                                    <div className="flex items-center gap-5 text-left">
                                        <div className="p-3 bg-zinc-50 rounded-xl group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground transition-colors">
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="text-lg font-bold text-zinc-900 block group-data-[state=open]:text-primary transition-colors">Order & Verification</span>
                                            <span className="text-sm text-zinc-400 font-normal">Phone confirmation & cancellation rules</span>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-zinc-500 leading-relaxed space-y-4 pb-8 pl-16 pr-4">
                                    <p>Orders are confirmed within <strong>one working day</strong> via phone. If unreachable after multiple attempts over 3 days, orders are automatically canceled to maintain efficiency.</p>
                                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 text-sm italic">
                                        Once an order is confirmed, it cannot be canceled. In case of a change of mind, simply pay the delivery charge to the agent upon arrival.
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Pricing Policy */}
                            <AccordionItem value="pricing-policy" className="bg-white border border-zinc-100 rounded-[1.5rem] px-6 transition-all data-[state=open]:shadow-md data-[state=open]:border-primary/20">
                                <AccordionTrigger className="hover:no-underline py-6 group">
                                    <div className="flex items-center gap-5 text-left">
                                        <div className="p-3 bg-zinc-50 rounded-xl group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground transition-colors">
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="text-lg font-bold text-zinc-900 block group-data-[state=open]:text-primary transition-colors">Pricing Standards</span>
                                            <span className="text-sm text-zinc-400 font-normal">BDT rates and shipping fees</span>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-zinc-500 leading-relaxed space-y-6 pb-8 pl-16 pr-4">
                                    <p>All prices are quoted in <strong>Bangladeshi Taka (BDT)</strong>. We reserve the right to cancel orders in extreme cases of system pricing malfunctions.</p>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">Inside Dhaka</span>
                                            <span className="text-2xl font-bold text-zinc-900">{insideDhakaCharge} BDT</span>
                                        </div>
                                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">Outside Dhaka</span>
                                            <span className="text-2xl font-bold text-zinc-900">{outsideDhakaCharge} BDT</span>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Delivery & Inspection */}
                            <AccordionItem value="delivery-policy" className="bg-white border border-zinc-100 rounded-[1.5rem] px-6 transition-all data-[state=open]:shadow-md data-[state=open]:border-primary/20">
                                <AccordionTrigger className="hover:no-underline py-6 group">
                                    <div className="flex items-center gap-5 text-left">
                                        <div className="p-3 bg-zinc-50 rounded-xl group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground transition-colors">
                                            <Truck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="text-lg font-bold text-zinc-900 block group-data-[state=open]:text-primary transition-colors">Shipping & Inspection</span>
                                            <span className="text-sm text-zinc-400 font-normal">Regional timelines & quality checks</span>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-zinc-500 leading-relaxed space-y-6 pb-8 pl-16 pr-4">
                                    <div className="grid gap-8 sm:grid-cols-2">
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-zinc-900 flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-primary" /> Dhaka City
                                            </h4>
                                            <ul className="text-xs space-y-2">
                                                <li className="flex gap-2 items-start"><ChevronRight className="h-3 w-3 mt-0.5 text-primary/40" /> 2-3 Days delivery.</li>
                                                <li className="flex gap-2 items-start"><ChevronRight className="h-3 w-3 mt-0.5 text-primary/40" /> Must inspect in front of agent.</li>
                                                <li className="flex gap-2 items-start"><ChevronRight className="h-3 w-3 mt-0.5 text-primary/40" /> Complaints post-delivery aren't accepted.</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="font-bold text-zinc-900 flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-primary" /> Outside Dhaka
                                            </h4>
                                            <ul className="text-xs space-y-2">
                                                <li className="flex gap-2 items-start"><ChevronRight className="h-3 w-3 mt-0.5 text-primary/40" /> 2-5 Working days.</li>
                                                <li className="flex gap-2 items-start"><ChevronRight className="h-3 w-3 mt-0.5 text-primary/40" /> Quality/Color inspection at doorstep.</li>
                                                <li className="flex gap-2 items-start"><ChevronRight className="h-3 w-3 mt-0.5 text-primary/40" /> Exchange subject to charges.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Return & Exchange */}
                            <AccordionItem value="returns-policy" className="bg-white border border-zinc-100 rounded-[1.5rem] px-6 transition-all data-[state=open]:shadow-md data-[state=open]:border-primary/20">
                                <AccordionTrigger className="hover:no-underline py-6 group">
                                    <div className="flex items-center gap-5 text-left">
                                        <div className="p-3 bg-zinc-50 rounded-xl group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground transition-colors">
                                            <RefreshCcw className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="text-lg font-bold text-zinc-900 block group-data-[state=open]:text-primary transition-colors">Returns & Refunds</span>
                                            <span className="text-sm text-zinc-400 font-normal">5-day window and defect protection</span>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-zinc-500 leading-relaxed space-y-6 pb-8 pl-16 pr-4">
                                    <div className="bg-primary p-6 rounded-2xl text-primary-foreground relative overflow-hidden">
                                        <div className="relative z-10 flex gap-4 items-start">
                                            <AlertCircle className="h-6 w-6 text-primary-foreground/80 shrink-0" />
                                            <div>
                                                <h4 className="font-bold mb-1">Defective Item Policy</h4>
                                                <p className="text-sm text-primary-foreground/90 leading-relaxed">Inform us with photos/videos within 48 hours for a free replacement. Returns for other reasons must be requested within 5 days.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4 text-sm">
                                        <p><strong>Eligibility:</strong> Items must be unused, in original condition with all tags and the invoice intact.</p>
                                        <p><strong>Refunds:</strong> Processed within 5-7 working days after quality inspection. Note: Delivery charges are non-refundable.</p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Branding & Commitment */}
                    <section className="bg-primary/5 border border-primary/10 p-12 lg:p-20 rounded-[3rem] text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/50 blur-[80px] rounded-full -mr-32 -mt-32"></div>
                        <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                            <div className="space-y-4">
                                <h2 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">Confidence in Quality.</h2>
                                <p className="text-zinc-500 text-lg leading-relaxed">
                                    "Luxury is not just what you wear — it’s how you feel. And at {storeName}, we stand behind every pair we craft."
                                </p>
                            </div>
                            <div className="pt-10 border-t border-primary/10 grid grid-cols-2 sm:grid-cols-4 gap-8">
                                <div>
                                    <span className="block text-2xl font-bold text-primary">7 Days</span>
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Support</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-bold text-primary">Secure</span>
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Checkout</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-bold text-primary">Official</span>
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Brand</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-bold text-primary">Quality</span>
                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Assured</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="text-center text-zinc-400 font-bold uppercase tracking-[0.3em] text-xs pb-12">
                        Designed For Distinction. Born In {storeName.includes("BD") ? "BD" : "Z BAZAR"}.
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
