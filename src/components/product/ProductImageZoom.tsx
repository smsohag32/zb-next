"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductImageZoomProps {
    src: string;
    alt: string;
    zoomFactor?: number;
    className?: string;
}

export function ProductImageZoom({
    src,
    alt,
    zoomFactor = 2.5,
    className,
}: ProductImageZoomProps) {
    const [showZoom, setShowZoom] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePos({ x, y });
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const touch = e.touches[0];
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();

        const x = Math.max(0, Math.min(100, ((touch.clientX - left) / width) * 100));
        const y = Math.max(0, Math.min(100, ((touch.clientY - top) / height) * 100));

        setMousePos({ x, y });
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative aspect-square w-full overflow-hidden  bg-muted border border-border/50 cursor-zoom-in group   transition-shadow duration-300",
                className
            )}
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setShowZoom(true)}
            onTouchEnd={() => setShowZoom(false)}
            onTouchMove={handleTouchMove}
        >
            {/* Base Image */}
            <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover"
            />

            {/* Zoom Overlay */}
            <AnimatePresence>
                {showZoom && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                            backgroundImage: `url(${src})`,
                            backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                            backgroundSize: `${zoomFactor * 100}%`,
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        {/* Professional Micro-details: Subtle Inner Glow */}
                        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.05)] ring-1 ring-white/20" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hover Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-20 transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:bottom-6">
                <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-medium px-3 py-1.5 rounded-full border border-white/20 whitespace-nowrap shadow-xl uppercase tracking-wider">
                    Roll over to zoom
                </span>
            </div>
        </div>
    );
}
