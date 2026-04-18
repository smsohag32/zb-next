"use client";

import darkLogo from "@/assets/dark-logo.webp";
import lightLogo from "@/assets/light-logo.webp";
import Image from "next/image";
import { useThemeStore } from "@/stores/themeStore";
import { useEffect, useState } from "react";

export default function Logo({ ...props }) {
   const { theme } = useThemeStore();
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   // To avoid hydration mismatch, render a default logo until mounted
   if (!mounted) {
      return (
         <Image
            {...props}
            src={lightLogo}
            alt="ZBazar Logo"
            width={160}
            height={40}
         />
      );
   }

   if (theme === "dark") {
      return (
         <Image
            {...props}
            src={darkLogo}
            alt="ZBazar Logo"
            width={160}
            height={40}
         />
      );
   }

   return (
      <Image
         {...props}
         src={lightLogo}
         alt="ZBazar Logo"
         width={160}
         height={40}
      />
   );
}
