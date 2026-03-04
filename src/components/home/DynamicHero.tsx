"use client";

import { useHeroContentQuery } from "@/redux-store/apis_action/hero_content";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import { HeroSection } from "./HeroSection";
import { HeroSection2 } from "./HeroSection2";
import { HeroSection3 } from "./HeroSection3";

const DynamicHero: React.FC = () => {
   const { data, isLoading } = useHeroContentQuery("");
   const heroContent = data?.data || [];

   // Loading skeleton
   if (isLoading) {
      return (
         <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary">
            <div className="container py-16 lg:py-16">
               <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
                  {/* Left skeleton */}
                  <div className="max-w-xl space-y-6">
                     <Skeleton className="h-6 w-32 rounded-full" />
                     <Skeleton className="h-16 w-full rounded-lg" />
                     <Skeleton className="h-4 w-3/4 rounded-md" />
                     <div className="flex gap-4">
                        <Skeleton className="h-10 w-32 rounded-lg" />
                        <Skeleton className="h-10 w-32 rounded-lg" />
                     </div>
                  </div>
                  <Skeleton className="h-[500px] w-full rounded-3xl" />
               </div>
            </div>
         </section>
      );
   }

   // No content fallback
   if (!heroContent.length) {
      return (
         <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary">
            <div className="container py-16 lg:py-16 text-center">
               <p className="text-lg text-muted-foreground">No content available</p>
            </div>
         </section>
      );
   }

   switch (heroContent[0]?.layout) {
      case "layout_1":
         return <HeroSection heroContent={heroContent} />;
      case "layout_2":
         return <HeroSection2 heroContent={heroContent} />;
      case "layout_3":
         return <HeroSection3 heroContent={heroContent} />;
   }
};

export default DynamicHero;
