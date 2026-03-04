import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { User, Package, Heart, MapPin, Bell, Settings, LogOut } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartSheet } from "@/components/cart/CartSheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/redux-store/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux-store";

const sidebarItems = [
   { icon: User, label: "Profile", href: "/dashboard" },
   { icon: Package, label: "Orders", href: "/dashboard/orders" },
   { icon: Heart, label: "Wishlist", href: "/dashboard/wishlist" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
   const pathname = usePathname();
   const dispatch = useDispatch<AppDispatch>();
   const router = useRouter();
   const handleLogout = () => {
      dispatch(logoutUser());
      router.push("/");
   };
   return (
      <div className="flex min-h-screen flex-col">
         <Header />
         <main className="flex-1 pb-16 lg:pb-0">
            <div className="container py-8">
               <h1 className=" text-3xl font-bold">My Account</h1>
               <p className="mt-2 text-muted-foreground">
                  Manage your account settings and preferences
               </p>

               <div className="mt-8 grid gap-8 lg:grid-cols-4">
                  {/* Sidebar */}
                  <aside className="lg:col-span-1">
                     <nav className="space-y-1">
                        {sidebarItems.map((item) => (
                           <Link
                              key={item.href}
                              href={item.href}
                              className={cn(
                                 "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                                 pathname === item.href
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-secondary"
                              )}>
                              <item.icon className="h-5 w-5" />
                              {item.label}
                           </Link>
                        ))}
                        <Separator className="my-2" />
                        <button
                           onClick={() => handleLogout()}
                           className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                           <LogOut className="h-5 w-5" />
                           Sign Out
                        </button>
                     </nav>
                  </aside>

                  {/* Content */}
                  <div className="lg:col-span-3">
                     {children}
                  </div>
               </div>
            </div>
         </main>
         <Footer />
         <MobileNav />
         <CartSheet />
      </div>
   );
}
