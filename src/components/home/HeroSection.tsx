"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

export function HeroSection({ heroContent }: any) {
   const [currentSlide, setCurrentSlide] = useState(0);
   const [isAnimating, setIsAnimating] = useState(false);
   const intervalRef = useRef<NodeJS.Timeout | null>(null);
   const router = useRouter();

   // Start auto-slide interval
   const startAutoSlide = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
         setIsAnimating(true);
         setCurrentSlide((prev) => (prev + 1) % heroContent.length);
         setTimeout(() => setIsAnimating(false), 800);
      }, 5000);
   };

   useEffect(() => {
      if (heroContent.length > 0) startAutoSlide();
      return () => {
         if (intervalRef.current) clearInterval(intervalRef.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [heroContent.length]);

   const changeSlide = (index: number) => {
      if (isAnimating || index === currentSlide) return;
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 800);
      startAutoSlide();
   };

   const handleNext = () => {
      changeSlide((currentSlide + 1) % heroContent.length);
   };

   const handlePrev = () => {
      changeSlide((currentSlide - 1 + heroContent.length) % heroContent.length);
   };

   const slide = heroContent[currentSlide];

   return (
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary">
         <div className="container relative z-10 py-16 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-6">
               {/* Left Content */}
               <div className="max-w-2xl">
                  <div
                     key={`badge-${slide.id}`}
                     className="animate-in fade-in slide-in-from-left-5 duration-500">
                     <span className="inline-block text-sm font-medium uppercase tracking-widest text-primary bg-primary/10 px-4 py-2 rounded-full">
                        {slide.badge}
                     </span>
                  </div>

                  <div
                     key={`title-${slide.id}`}
                     className="mt-6 animate-in fade-in slide-in-from-left-5 duration-500 delay-100">
                     <h1 className=" text-4xl font-bold leading-tight lg:text-6xl">
                        {slide.title}
                        <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                           {slide.titleAccent}
                        </span>
                     </h1>
                  </div>

                  <div
                     key={`desc-${slide.id}`}
                     className="mt-6 animate-in fade-in slide-in-from-left-5 duration-500 delay-200">
                     <p className="text-lg text-muted-foreground leading-relaxed">
                        {slide.description}
                     </p>
                  </div>

                  <div
                     key={`btns-${slide.id}`}
                     className="mt-8 flex flex-wrap gap-4 animate-in fade-in slide-in-from-left-5 duration-500 delay-300">
                     {slide.primaryBtn && (
                        <Button
                           size="lg"
                           onClick={() => router.push(slide.primaryBtn.link)}
                           className="group">
                           {slide.primaryBtn.text}
                           <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                     )}
                     {slide.secondaryBtn?.text && (
                        <Button
                           size="lg"
                           variant="outline">
                           {slide.secondaryBtn.text}
                        </Button>
                     )}
                  </div>
               </div>

               {/* Right Image */}
               <div className="relative">
                  <div className="relative aspect-[3/3] max-w-xl ml-auto overflow-hidden rounded-3xl">
                     {heroContent.map((s: any, index: any) => (
                        <div
                           key={s.id}
                           className={`absolute inset-0 transition-all duration-700 ${index === currentSlide
                              ? "opacity-100 scale-100"
                              : index < currentSlide
                                 ? "opacity-0 scale-95 -translate-x-full"
                                 : "opacity-0 scale-95 translate-x-full"
                              }`}>
                           <img
                              src={
                                 s?.image
                                    ? `${process.env.NEXT_PUBLIC_BASE_URL?.replace(
                                       /\/$/,
                                       ""
                                    )}/${s?.image.replace(/^\/+/, "")}`
                                    : "/placeholder.svg"
                              }
                              alt={`${s.title} ${s.titleAccent}`}
                              width={1920}
                              height={600}
                              fetchPriority={index === 0 ? "high" : "auto"}
                              loading={index === 0 ? "eager" : "lazy"}
                              className="h-full w-full object-cover"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
                        </div>
                     ))}

                     {/* Navigation Arrows */}
                     <button
                        onClick={handlePrev}
                        disabled={isAnimating}
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-all disabled:opacity-50">
                        <ChevronLeft className="h-5 w-5" />
                     </button>
                     <button
                        onClick={handleNext}
                        disabled={isAnimating}
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-all disabled:opacity-50">
                        <ChevronRight className="h-5 w-5" />
                     </button>

                     {/* Slide Indicators */}
                     <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                        {heroContent.map((_: any, index: any) => (
                           <button
                              key={index}
                              onClick={() => changeSlide(index)}
                              disabled={isAnimating}
                              className={`h-2 rounded-full transition-all disabled:opacity-50 ${index === currentSlide
                                 ? "w-8 bg-primary"
                                 : "w-2 bg-background/60 hover:bg-background/80"
                                 }`}
                           />
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Background Decorations */}
         <div className="absolute top-0 right-0 -z-10 h-full w-1/2 bg-gradient-to-l from-primary/5 to-transparent" />
         <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
         <div className="absolute top-20 right-20 -z-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl animate-pulse delay-1000" />
      </section>
   );
}
