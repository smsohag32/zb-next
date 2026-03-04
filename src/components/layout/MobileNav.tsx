"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, ShoppingBag, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hook/useAuth";
import { useCartStore } from "@/stores/cartStore";

export function MobileNav() {
   const pathname = usePathname();
   const { user } = useAuth();
   const { getItemCount } = useCartStore();
   const cartCount = getItemCount();

   const navItems = [
      { icon: Home, label: "Home", href: "/" },
      { icon: Search, label: "Shop", href: "/products" },
      { icon: ShoppingBag, label: "Cart", isCenter: true, href: "/cart" },
      { icon: Grid3X3, label: "Category", href: "/categories" },
      { icon: User, label: "Account", href: user?.email ? "/dashboard" : "/login" },
   ];

   return (
      <nav className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden pb-0 pointer-events-none">
         <div className="relative flex items-center justify-between h-16 bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] pointer-events-auto">
            {navItems.map((item, index) => {
               if (item.isCenter) {
                  return (
                     <div key="center-cart" className="relative flex-1 flex flex-col items-center">
                        <Link
                           href={item.href}
                           className="absolute -top-12 flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-[0_10px_25px_-5px_rgb(var(--primary)/0.5)] border-[5px] border-background transition-all duration-300 hover:scale-105 active:scale-90 group">
                           <item.icon className="h-7 w-7 transition-transform group-active:scale-90" />
                           {cartCount > 0 && (
                              <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-white text-[11px] font-bold text-primary flex items-center justify-center shadow-lg border-2 border-primary animate-in zoom-in duration-300">
                                 {cartCount}
                              </span>
                           )}
                        </Link>
                     </div>
                  );
               }

               const isActive = pathname === item.href;
               return (
                  <Link
                     key={item.href || index}
                     href={item.href || "#"}
                     className={cn(
                        "flex flex-col items-center justify-center flex-1 gap-1 h-14 rounded-2xl transition-all duration-500",
                        isActive ? "text-primary" : "text-muted-foreground/80 hover:text-foreground"
                     )}>
                     <item.icon
                        className={cn(
                           "h-5 w-5 transition-transform duration-300",
                           isActive && "scale-110"
                        )}
                     />
                     <span
                        className={cn(
                           "text-[10px] font-bold tracking-tight transition-all",
                           isActive ? "opacity-100" : "opacity-80"
                        )}>
                        {item.label}
                     </span>
                  </Link>
               );
            })}
         </div>
      </nav>
   );
}
