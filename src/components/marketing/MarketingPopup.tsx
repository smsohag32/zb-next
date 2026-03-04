"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getPopupConfig } from "../../services/marketing";
import { getImageUrl } from "@/lib/getImage";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

interface PopupConfig {
    enabled: boolean;
    title: string | null;
    content: string | null;
    imageUrl: string | null;
    buttonText: string | null;
    buttonLink: string | null;
    badgeText: string | null;
    delaySeconds: number;
}

export const MarketingPopup = () => {
    const [config, setConfig] = useState<PopupConfig | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            // Check if already closed in this session
            const hasSeenPopup = sessionStorage.getItem("popup_closed");
            if (hasSeenPopup) return;

            const data = await getPopupConfig();
            if (data && data.enabled) {
                setConfig(data);
                // Show after delay
                setTimeout(() => {
                    setShowPopup(true);
                }, (data.delaySeconds || 3) * 1000);
            }
        };

        fetchConfig();
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowPopup(false);
            sessionStorage.setItem("popup_closed", "true");
        }, 300); // Allow animation to finish
    };

    if (!config) return null;

    return (
        <AnimatePresence>
            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10" role="dialog" aria-modal="true">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Popup Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-3xl overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl flex flex-col md:flex-row z-10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
                            aria-label="Close popup"
                        >
                            <X className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                        </button>

                        {/* Image Section */}
                        {config.imageUrl && (
                            <div className="relative w-full md:w-1/2 h-56 md:h-auto overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-none z-10 md:hidden" />
                                <img
                                    src={getImageUrl(config.imageUrl)}
                                    alt={config.title || "Special Offer"}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                                {config.badgeText && (
                                    <div className="absolute top-4 left-4 z-20 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                                        {config.badgeText}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Content Section */}
                        <div className={`relative flex flex-col justify-center p-8 sm:p-10 ${config.imageUrl ? 'w-full md:w-1/2' : 'w-full text-center items-center'}`}>
                            {!config.imageUrl && config.badgeText && (
                                <div className="mb-6 inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {config.badgeText}
                                </div>
                            )}

                            <div className="space-y-4">
                                {config.title && (
                                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
                                        {config.title}
                                    </h2>
                                )}

                                {config.content && (
                                    <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                        {config.content}
                                    </p>
                                )}

                                {config.buttonText && config.buttonLink && (
                                    <div className="pt-4">
                                        <a href={config.buttonLink} onClick={handleClose} className="block w-full">
                                            <Button size="lg" className="w-full font-bold text-base h-12 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
                                                {config.buttonText}
                                            </Button>
                                        </a>
                                        <button
                                            onClick={handleClose}
                                            className="mt-4 w-full text-xs text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-200 underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 transition-colors"
                                        >
                                            No thanks, I'm not interested
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
