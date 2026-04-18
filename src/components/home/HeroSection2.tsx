"use client";

import React from "react";
import { useHeroContentQuery } from "@/redux-store/apis_action/hero_content";
import { getImageUrl } from "@/lib/getImage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectCreative } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

interface HeroContentItem {
   image: string;
   title?: string;
   subtitle?: string;
}

export function HeroSection2({ heroContent }: { heroContent: HeroContentItem[] }) {
   const progressLineRef = React.useRef<HTMLDivElement>(null);

   if (!heroContent || heroContent.length === 0) return null;

   const onAutoplayTimeLeft = (s: any, time: number, progress: number) => {
      if (progressLineRef.current) {
         // Swiper progress goes from 1 to 0 as time runs out
         progressLineRef.current.style.width = `${(1 - progress) * 100}%`;
      }
   };

   return (
      <section className="relative w-full overflow-hidden group/hero font-display">
         {/* Aspect ratio wrapper: 16/7 on mobile, 3:1 on desktop */}
         <div className="relative w-full aspect-[16/7] bg-gray-100! md:aspect-[3/1]">
            <Swiper
               modules={[Autoplay, Pagination, Navigation, EffectCreative]}
               effect="creative"
               creativeEffect={{
                  prev: {
                     translate: [0, 0, -400],
                     opacity: 0,
                     scale: 0.85
                  },
                  next: {
                     translate: ["100%", 0, 0],
                     opacity: 1
                  }
               }}
               loop={true}
               speed={2000}
               watchSlidesProgress={true}
               autoplay={{
                  delay: 6000,
                  disableOnInteraction: false,
               }}
               onAutoplayTimeLeft={onAutoplayTimeLeft}
               pagination={{
                  clickable: true,
                  el: ".custom-swiper-pagination",
                  renderBullet: (index, className) => {
                     return `<span class="${className} custom-bullet"></span>`;
                  },
               }}
               navigation={{
                  nextEl: ".hero-next",
                  prevEl: ".hero-prev",
               }}
               className="w-full h-full"
            >
               {heroContent.map((slide, index) => (
                  <SwiperSlide key={index} className="relative w-full !h-full aspect-[16/7] md:aspect-[3/1] overflow-hidden">
                     {/* Glassmorphism Background Layer */}
                     <div className="absolute inset-0 z-0 h-full">
                        <img
                           src={getImageUrl(slide.image)}
                           alt=""
                           className="w-full h-full object-cover blur-3xl scale-125 opacity-20"
                           fetchPriority={index === 0 ? "high" : "auto"}
                           loading={index === 0 ? "eager" : "lazy"}
                        />
                     </div>

                     {/* Main Banner Image with Smooth Ken Burns Effect */}
                     <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden">
                        <img
                           src={getImageUrl(slide.image)}
                           alt={`Hero slide ${index + 1}`}
                           className="w-full h-full object-fill md:object-fill ken-burns swiper-image"
                           fetchPriority={index === 0 ? "high" : "auto"}
                           loading={index === 0 ? "eager" : "lazy"}
                        />

                        {/* Professional Multi-Layer Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 z-20 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10 z-20 pointer-events-none" />

                        {/* Premium "Light Scan" Shine Effect */}
                        <div className="absolute inset-0 z-30 pointer-events-none shine-overlay opacity-40" />
                     </div>
                  </SwiperSlide>
               ))}

               {/* Professional Navigation - Ultra Glassy */}
               <div className="absolute inset-x-4 md:inset-x-8 top-1/2 -translate-y-1/2 z-40 flex justify-between pointer-events-none">
                  <button
                     className="hero-prev pointer-events-auto h-11 w-11 md:h-14 md:w-14 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 text-white transition-all hover:bg-white/20 hover:scale-110 active:scale-95 shadow-2xl group/nav md:flex hidden opacity-0 group-hover/hero:opacity-100"
                     aria-label="Previous slide"
                  >
                     <ChevronLeft className="h-6 w-6 md:h-8 md:w-8 transition-transform group-hover/nav:-translate-x-0.5" />
                  </button>
                  <button
                     className="hero-next pointer-events-auto h-11 w-11 md:h-14 md:w-14 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 text-white transition-all hover:bg-white/20 hover:scale-110 active:scale-95 shadow-2xl group/nav md:flex hidden opacity-0 group-hover/hero:opacity-100"
                     aria-label="Next slide"
                  >
                     <ChevronRight className="h-6 w-6 md:h-8 md:w-8 transition-transform group-hover/nav:translate-x-0.5" />
                  </button>
               </div>

               {/* Premium Floating Pagination Dots */}
               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl hidden md:block">
                  <div className="custom-swiper-pagination flex gap-3 items-center" />
               </div>

               {/* Cinematic Autoplay Progress Bar */}
               <div className="absolute bottom-0 left-0 right-0 z-50 h-1 md:h-1.5 bg-white/5 overflow-hidden">
                  <div
                     ref={progressLineRef}
                     className="h-full bg-white/60 shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-100 linear"
                  />
               </div>

            </Swiper>
         </div>

         <style>{`
            .swiper, .swiper-wrapper, .swiper-slide {
               height: 100% !important;
            }
            .custom-bullet {
               width: 32px !important;
               height: 4px !important;
               border-radius: 4px !important;
               background: rgba(255, 255, 255, 0.1) !important;
               opacity: 1 !important;
               transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
               cursor: pointer;
            }
            .custom-bullet.swiper-pagination-bullet-active {
               background: rgba(255, 255, 255, 0.95) !important;
               width: 55px !important;
               box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
            }
            
            /* Enhanced Ken Burns - Professional Continuity */
            .swiper-slide-active .ken-burns {
               animation: kenburns-pro 15s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
            
            @keyframes kenburns-pro {
               0% { transform: scale(1.05) translate(0, 0); }
               100% { transform: scale(1.15) translate(-1%, -1%); }
            }

            /* Premium Shine Effect */
            .shine-overlay {
               background: linear-gradient(
                  120deg,
                  transparent 30%,
                  rgba(255, 255, 255, 0.05) 40%,
                  rgba(255, 255, 255, 0.15) 50%,
                  rgba(255, 255, 255, 0.05) 60%,
                  transparent 70%
               );
               background-size: 200% 100%;
               animation: shine-sweep-pro 10s infinite linear;
            }

            @keyframes shine-sweep-pro {
               0% { background-position: 200% 0; }
               100% { background-position: -200% 0; }
            }

            /* Swiper Image Default Transition */
            .swiper-image {
               transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1);
            }
         `}</style>
      </section>
   );
}
