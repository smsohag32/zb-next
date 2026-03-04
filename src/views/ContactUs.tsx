"use client";

import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store";
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter, Youtube, Linkedin, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { toast } from "sonner";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Seo } from "@/seo/Seo";

export default function ContactUs() {
    const { storeData } = useSelector((state: RootState) => state.store);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            toast.success("Thank you! Your message has been sent successfully.");
            setIsSubmitting(false);
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <div className="min-h-screen  pb-12 bg-background">
            <Seo
                storeData={{
                    metaTitle: `Contact Us | ${storeData.name || "ZBazar BD"}`,
                    metaDescription: `Get in touch with ${storeData.name || "ZBazar BD"}. We're here to help you with any questions or concerns.`,
                    metaTags: ["contact", "support", "help", storeData.name],
                }}
            />

            {/* Hero Section */}
            <section className="relative h-[300px] flex items-center justify-center bg-foreground text-background overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                    <img
                        src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=2070&auto=format&fit=crop"
                        alt="Contact background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight"
                    >
                        Contact us
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 text-lg text-background/80 max-w-2xl mx-auto"
                    >
                        Need assistance or have a question? Our team is here to help you with orders, products, and everything in between.
                    </motion.p>

                </div>
            </section>

            <div className="container mt-[-60px] relative z-20 max-w-5xl mx-auto">
                <div className="grid md:grid-cols-3 gap-6">
                    {/* PhoneCard */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card p-6 rounded-xl border border-border shadow-sm text-center flex flex-col items-center"
                    >
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                            <Phone className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Phone</h3>
                        <a href={storeData.phone ? `tel:${storeData.phone}` : "#"} className="text-lg font-semibold hover:text-primary transition-colors">
                            {storeData.phone || "-"}
                        </a>
                    </motion.div>

                    {/* Email Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card p-6 rounded-xl border border-border shadow-sm text-center flex flex-col items-center"
                    >
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                            <Mail className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Email</h3>
                        <a href={storeData.email ? `mailto:${storeData.email}` : "#"} className="text-lg font-semibold hover:text-primary transition-colors break-words max-w-full px-2">
                            {storeData.email || "-"}
                        </a>
                    </motion.div>

                    {/* Location Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card p-6 rounded-xl border border-border shadow-sm text-center flex flex-col items-center"
                    >
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Location</h3>
                        <address className="not-italic text-lg font-semibold">
                            {storeData.address || "-"}
                        </address>
                    </motion.div>
                </div>

                {/* Social Links & Map */}
                <div className="mt-12 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card p-8 rounded-xl border border-border shadow-sm text-center"
                    >
                        <h3 className="text-2xl font-bold mb-6">Connect with us on Social Media</h3>
                        <TooltipProvider>
                            <div className="flex justify-center gap-6">
                                {/* Facebook */}
                                {storeData.socials?.facebook && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a href={storeData.socials.facebook} target="_blank" rel="noreferrer" className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>Facebook</TooltipContent>
                                    </Tooltip>
                                )}

                                {/* Instagram */}
                                {storeData.socials?.instagram && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a href={storeData.socials.instagram} target="_blank" rel="noreferrer" className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                                </svg>
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>Instagram</TooltipContent>
                                    </Tooltip>
                                )}

                                {/* Twitter/X */}
                                {storeData.socials?.twitter && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a href={storeData.socials.twitter} target="_blank" rel="noreferrer" className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                </svg>
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>Twitter / X</TooltipContent>
                                    </Tooltip>
                                )}

                                {/* YouTube */}
                                {storeData.socials?.youtube && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a href={storeData.socials.youtube} target="_blank" rel="noreferrer" className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                </svg>
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>YouTube</TooltipContent>
                                    </Tooltip>
                                )}

                                {/* Threads */}
                                {storeData.socials?.threads && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a href={storeData.socials.threads} target="_blank" rel="noreferrer" className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                                                    <path d="M12.551 14.115c-1.129 0-2.046-.917-2.046-2.046s.917-2.046 2.046-2.046 2.046.917 2.046 2.046-.917 2.046-2.046 2.046zm0-5.467c-1.886 0-3.421 1.535-3.421 3.421s1.535 3.421 3.421 3.421 3.421-1.535 3.421-3.421-1.535-3.421-3.421-3.421zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10c1.332 0 2.606-.263 3.768-.737l-1.01-1.01A8.618 8.618 0 0 1 12 20.627c-4.755 0-8.627-3.872-8.627-8.627S7.245 3.373 12 3.373s8.627 3.872 8.627 8.627c0 1.295-.286 2.527-.796 3.633l.965.965c.783-1.42 1.206-3.033 1.206-4.598C22 6.477 17.523 2 12 2z" />
                                                </svg>
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>Threads</TooltipContent>
                                    </Tooltip>
                                )}

                                {/* LinkedIn */}
                                {storeData.socials?.linkedin && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a href={storeData.socials.linkedin} target="_blank" rel="noreferrer" className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                </svg>
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>LinkedIn</TooltipContent>
                                    </Tooltip>
                                )}

                                {/* Pinterest */}
                                {storeData.socials?.pinterest && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a href={storeData.socials.pinterest} target="_blank" rel="noreferrer" className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                                                </svg>
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>Pinterest</TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        </TooltipProvider>
                    </motion.div>

                    {/* Map Section */}
                    <section className="rounded-2xl overflow-hidden h-[450px] border border-border relative bg-muted group">
                        {storeData.address ? (
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(storeData.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                allowFullScreen
                                loading="lazy"
                                className="grayscale hover:grayscale-0 transition-all duration-700 contrast-125"
                            ></iframe>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
                                <MapPin className="h-12 w-12 opacity-20" />
                                <p className="text-xl font-medium">Map currently unavailable</p>
                                <p className="text-sm">Please update store address in settings</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
