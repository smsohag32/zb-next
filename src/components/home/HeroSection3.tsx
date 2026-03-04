"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/getImage";

const SLIDE_INTERVAL = 5000; // 5 seconds between slides

export function HeroSection3({ heroContent }: { heroContent: any }) {
   const [currentSlide, setCurrentSlide] = useState(0);
   const [isAutoPlay, setIsAutoPlay] = useState(true);
   const [direction, setDirection] = useState<"next" | "prev">("next");

   // Auto-play carousel
   useEffect(() => {
      if (!isAutoPlay) return;

      const interval = setInterval(() => {
         setDirection("next");
         setCurrentSlide((prev) => (prev + 1) % heroContent?.length);
      }, SLIDE_INTERVAL);

      return () => clearInterval(interval);
   }, [isAutoPlay, heroContent?.length]);

   const goToSlide = (index: number) => {
      setDirection(index > currentSlide ? "next" : "prev");
      setCurrentSlide(index);
      setIsAutoPlay(false);
      // Resume autoplay after 2 seconds of user interaction
      setTimeout(() => setIsAutoPlay(true), 2000);
   };

   const nextSlide = () => {
      setDirection("next");
      setCurrentSlide((prev) => (prev + 1) % heroContent?.length);
      setIsAutoPlay(false);
      setTimeout(() => setIsAutoPlay(true), 2000);
   };

   const prevSlide = () => {
      setDirection("prev");
      setCurrentSlide((prev) => (prev - 1 + heroContent?.length) % heroContent?.length);
      setIsAutoPlay(false);
      setTimeout(() => setIsAutoPlay(true), 2000);
   };

   return (
      <div className="relative w-full overflow-hidden   sm:container mx-auto">
         <div className="relative aspect-[3/1] w-full overflow-hidden">
            {/* Slides container */}
            <div className="relative  h-full w-full">
               {heroContent?.map((image: any, index: any) => (
                  <div
                     key={index}
                     className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}>
                     <img
                        src={getImageUrl(image?.image)}
                        alt={`Carousel slide ${index + 1}`}
                        className={`h-full  w-full object-cover transition-transform duration-1000 ease-out ${index === currentSlide ? "scale-100" : "scale-105"
                           }`}
                     />
                     <div className="absolute inset-0 bg-black/10 transition-opacity duration-1000" />
                  </div>
               ))}
            </div>

            <button
               onClick={prevSlide}
               aria-label="Previous slide"
               className="absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 group">
               <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-300 hover:bg-white/40 hover:scale-110 active:scale-95">
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-white transition-transform group-hover:scale-125" />
               </div>
            </button>

            <button
               onClick={nextSlide}
               aria-label="Next slide"
               className="absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 group">
               <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-300 hover:bg-white/40 hover:scale-110 active:scale-95">
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-white transition-transform group-hover:scale-125" />
               </div>
            </button>

            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3">
               {heroContent?.map((_: any, index: any) => (
                  <button
                     key={index}
                     onClick={() => goToSlide(index)}
                     aria-label={`Go to slide ${index + 1}`}
                     className={`transition-all duration-300 rounded-full backdrop-blur-sm border ${index === currentSlide
                        ? "h-3 sm:h-3.5 w-8 sm:w-10 bg-white border-white shadow-lg shadow-white/50"
                        : "h-2.5 sm:h-3 w-2.5 sm:w-3 bg-white/40 border-white/30 hover:bg-white/60"
                        }`}
                  />
               ))}
            </div>

            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 bg-black/40 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20">
               {currentSlide + 1} / {heroContent?.length}
            </div>
         </div>

         <style jsx>{`
            @keyframes slideInFromLeft {
               from {
                  opacity: 0;
                  transform: translateX(-20px);
               }
               to {
                  opacity: 1;
                  transform: translateX(0);
               }
            }

            @keyframes slideInFromRight {
               from {
                  opacity: 0;
                  transform: translateX(20px);
               }
               to {
                  opacity: 1;
                  transform: translateX(0);
               }
            }
         `}</style>
      </div>
   );
}
