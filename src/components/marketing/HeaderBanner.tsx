"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getBannerConfig } from "../../services/marketing";

interface BannerConfig {
    enabled: boolean;
    title: string | null;
    buttonText: string | null;
    buttonLink: string | null;
    badgeText: string | null;
    backgroundColor: string;
    textColor: string;
    isSticky: boolean;
}

export const HeaderBanner = () => {
    const [config, setConfig] = useState<BannerConfig | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            // Check if already closed in this session
            const hasSeenBanner = sessionStorage.getItem("banner_closed");
            if (hasSeenBanner) return;

            const data = await getBannerConfig();
            if (data && data.enabled) {
                setConfig(data);
                setIsVisible(true);
            }
        };

        fetchConfig();
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem("banner_closed", "true");
    };

    if (!isVisible || !config) return null;

    return (
        <div
            className={`w-full transition-all duration-300 ease-in-out ${config.isSticky ? 'sticky top-0 z-[60]' : 'relative z-40'}`}
            style={{ backgroundColor: config.backgroundColor, color: config.textColor }}
        >
            <div className="container mx-auto ps-4 pe-6 lg:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-2 sm:gap-4 relative">

                <div className="flex items-center gap-2 justify-center flex-wrap">
                    {config.badgeText && (
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                            {config.badgeText}
                        </span>
                    )}

                    {config.title && (
                        <span className="text-sm font-medium leading-tight">
                            {config.title}
                        </span>
                    )}
                </div>

                {config.buttonText && config.buttonLink && (
                    <a
                        href={config.buttonLink}
                        className="text-xs font-bold underline underline-offset-4 hover:no-underline opacity-90 hover:opacity-100 transition-opacity whitespace-nowrap"
                        style={{ color: config.textColor }}
                    >
                        {config.buttonText}
                    </a>
                )}

                <button
                    onClick={handleClose}
                    className="absolute right-2  sm:right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors opacity-80 hover:opacity-100"
                    aria-label="Close banner"
                    style={{ color: config.textColor }}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
