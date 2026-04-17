"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
   Search,
   Heart,
   ShoppingBag,
   User,
   Menu,
   Phone,
   Sun,
   Moon,
   MenuIcon,
   LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useThemeStore } from "@/stores/themeStore";
import { useState, useEffect, useRef } from "react";
import { useGetCategoriesQuery } from "@/redux-store/apis_action/category";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux-store";
import { setStoreData } from "@/redux-store/slices/storeSlice";
import { setCategories, setError, setLoading } from "@/redux-store/slices/categorySlice";
import { useGetStoreInfoQuery } from "@/redux-store/apis_action/store";
import { useAuth } from "@/hook/useAuth";
import { logoutUser } from "@/redux-store/slices/authSlice";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import Logo from "@/assets/Logo";
import { getImageUrl } from "@/lib/getImage";

export function Header() {
   const { openCart, getItemCount } = useCartStore();
   const { items: wishlistItems } = useWishlistStore();
   const { theme, toggleTheme } = useThemeStore();
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const [isVisible, setIsVisible] = useState(true);
   const [lastScrollY, setLastScrollY] = useState(0);
   const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
   const categoryMenuRef = useRef<HTMLDivElement>(null);
   const [searchQuery, setSearchQuery] = useState("");
   const router = useRouter();
   const { user } = useAuth();
   const cartCount = getItemCount();
   const { data: storeInfo, isLoading } = useGetStoreInfoQuery("");

   const {
      data,
      isLoading: metaDataLoading,
      error,
   } = useGetCategoriesQuery({ page: 0, limit: 100 });
   const dispatch = useDispatch();
   const { categories } = useSelector((state: RootState) => state.category);

   useEffect(() => {
      if (storeInfo) {
         dispatch(setStoreData(storeInfo));
      }
   }, [storeInfo, dispatch]);

   useEffect(() => {
      dispatch(setLoading(isLoading));
      if (error) {
         dispatch(
            setError((error as { message?: string })?.message || "Failed to fetch categories"),
         );
      }
      if (data?.data?.data) {
         const reversedCategories = [...data.data.data].reverse();
         dispatch(setCategories(reversedCategories));
      }
   }, [data, isLoading, error, dispatch]);

   useEffect(() => {
      const controlNavbar = () => {
         const currentScrollY = window.scrollY;
         if (currentScrollY < 10) {
            setIsVisible(true);
         } else if (currentScrollY < lastScrollY) {
            setIsVisible(true);
         } else if (currentScrollY > lastScrollY) {
            setIsVisible(false);
         }
         setLastScrollY(currentScrollY);
      };
      window.addEventListener("scroll", controlNavbar);
      return () => window.removeEventListener("scroll", controlNavbar);
   }, [lastScrollY]);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
            setCategoryMenuOpen(false);
         }
      };
      if (categoryMenuOpen) {
         document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [categoryMenuOpen]);

   const handleLogout = () => {
      dispatch(logoutUser());
      router.push("/login");
   };

   return (
      <>
         <header
            className={`sticky top-0 z-50 w-full bg-background transition-transform duration-300 ${
               isVisible ? "translate-y-0" : "max-lg:-translate-y-full"
            }`}>
            {/* Top bar */}
            <div className="border-b border-border/50">
               <div className="container flex h-14 items-center justify-between lg:gap-8">
                  {/* Mobile Menu Trigger */}
                  <div className="lg:hidden flex-1">
                     <Sheet
                        open={mobileMenuOpen}
                        onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                           <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Open Mobile Menu">
                              <Menu className="h-5 w-5" />
                           </Button>
                        </SheetTrigger>
                        <SheetContent
                           side="left"
                           className="w-80 flex flex-col p-0">
                           <div className="flex flex-col gap-6 px-6 pt-6 pb-2">
                              <Link
                                 href="/"
                                 className="text-2xl font-bold text-primary"
                                 onClick={() => setMobileMenuOpen(false)}>
                                 ZBazar BD
                              </Link>
                              <div className="relative">
                                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                 <Input
                                    placeholder="Search..."
                                    className="pl-10"
                                 />
                              </div>
                           </div>
                           <ScrollArea className="flex-1 px-6 pb-6 mt-4">
                              <nav className="flex flex-col gap-4">
                                 <Link
                                    href="/"
                                    className="font-medium"
                                    onClick={() => setMobileMenuOpen(false)}>
                                    Home
                                 </Link>
                                 <Link
                                    href="/products"
                                    className="font-medium"
                                    onClick={() => setMobileMenuOpen(false)}>
                                    All Products
                                 </Link>
                                 {categories?.slice(0, 12)?.map((cat) => (
                                    <Link
                                       key={cat.id}
                                       href={`/products/category/${cat.slug}`}
                                       className="text-muted-foreground hover:text-foreground"
                                       onClick={() => setMobileMenuOpen(false)}>
                                       {cat.name}
                                    </Link>
                                 ))}
                              </nav>
                           </ScrollArea>
                        </SheetContent>
                     </Sheet>
                  </div>

                  {/* Logo */}
                  <div className="flex-1 flex justify-center lg:justify-start lg:flex-none">
                     <Link
                        href="/"
                        className="flex items-center space-x-2">
                        <Logo className="max-w-[140px] md:max-w-[160px]" />
                     </Link>
                  </div>

                  {/* Search - Desktop */}
                  <div className="hidden flex-1 max-w-md mx-8 lg:flex">
                     <div className="relative w-full flex overflow-hidden rounded-md border dark:border-gray-800 border-gray-300 bg-secondary/50 transition focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        <input
                           type="text"
                           placeholder="Search products..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           onKeyDown={(e) => {
                              if (e.key === "Enter" && searchQuery.trim()) {
                                 router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                                 setSearchQuery("");
                              }
                           }}
                           className="flex-1 pl-10 pr-4 py-2 bg-transparent outline-none border-none"
                        />
                        <button
                           className="px-5 bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors focus:outline-none"
                           onClick={() => {
                              if (searchQuery.trim()) {
                                 router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                                 setSearchQuery("");
                              }
                           }}>
                           Search
                        </button>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-1 flex justify-end items-center lg:gap-2 lg:flex-none">
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label="Toggle Theme"
                        className="flex hover:bg-transparent md:hover:bg-transparent text-foreground   hover:text-accent">
                        {theme === "light" ? (
                           <Moon className="h-5 w-5" />
                        ) : (
                           <Sun className="h-5 w-5" />
                        )}
                     </Button>

                     <Link href="/wishlist">
                        <Button
                           variant="ghost"
                           size="icon"
                           aria-label="Wishlist"
                           className="relative hidden hover:bg-transparent md:hover:bg-transparent text-foreground   hover:text-accent sm:flex">
                           <Heart className="h-5 w-5" />
                           {wishlistItems.length > 0 && (
                              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
                                 {wishlistItems.length}
                              </span>
                           )}
                        </Button>
                     </Link>

                     <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Open Cart"
                        className="relative hover:bg-transparent md:hover:bg-transparent text-foreground   hover:text-accent"
                        onClick={openCart}>
                        <ShoppingBag className="h-5 w-5" />
                        {cartCount > 0 && (
                           <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
                              {cartCount}
                           </span>
                        )}
                     </Button>

                     {/* User Menu */}
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button
                              variant="ghost"
                              size="icon"
                              aria-label="User Account"
                              className="hidden sm:flex hover:bg-transparent md:hover:bg-transparent text-foreground   hover:text-accent">
                              <User className="h-5 w-5" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                           align="end"
                           className="w-48 p-3">
                           {user?.email ? (
                              <>
                                 <DropdownMenuItem
                                    className="cursor-pointer"
                                    asChild>
                                    <Link href="/dashboard/orders">Orders</Link>
                                 </DropdownMenuItem>
                                 <DropdownMenuItem
                                    className="cursor-pointer"
                                    asChild>
                                    <Link href="/dashboard">My Account</Link>
                                 </DropdownMenuItem>
                                 <Separator />
                                 <DropdownMenuItem
                                    className="cursor-pointer gap-2 text-destructive mt-2"
                                    onClick={handleLogout}>
                                    <LogOut size={15} /> Logout
                                 </DropdownMenuItem>
                              </>
                           ) : (
                              <>
                                 <DropdownMenuItem
                                    className="cursor-pointer"
                                    asChild>
                                    <Link href="/login">Sign In</Link>
                                 </DropdownMenuItem>
                                 <DropdownMenuItem
                                    className="cursor-pointer"
                                    asChild>
                                    <Link href="/register">Create Account</Link>
                                 </DropdownMenuItem>
                              </>
                           )}
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
               </div>
            </div>
         </header>

         {/* Navigation bar - Desktop */}
         <div
            className={`hidden lg:block sticky top-14 z-40 bg-background border-b border-border/50 transition-transform duration-300 ${
               isVisible ? "translate-y-0" : "-translate-y-full"
            }`}>
            <div className="container flex h-12 items-center justify-between">
               <div className="flex items-center gap-1">
                  {/* Browse Collection Dropdown */}
                  <div
                     className="relative"
                     ref={categoryMenuRef}>
                     <button
                        onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                        className="inline-flex items-center gap-2 justify-center rounded-none text-sm font-medium bg-primary text-primary-foreground h-11 px-4 py-2 hover:bg-primary/90 transition-colors">
                        <MenuIcon /> Browse Collection
                     </button>

                     {categoryMenuOpen && (
                        <div className="absolute left-0 top-full mt-1 w-[500px] rounded-md border bg-popover shadow-lg">
                           <ScrollArea className="h-[78vh] p-6">
                              <div className="grid gap-2 grid-cols-2">
                                 {categories.map((cat) => (
                                    <Link
                                       key={cat.id}
                                       href={`/products/category/${cat.slug}`}
                                       onClick={() => setCategoryMenuOpen(false)}
                                       className="group flex items-center gap-4 rounded-lg p-3 hover:bg-secondary transition-colors">
                                       {/* eslint-disable-next-line @next/next/no-img-element */}
                                       <img
                                          src={getImageUrl(cat?.image)}
                                          alt={cat.name}
                                          className="h-10 w-10 rounded-md object-cover"
                                       />
                                       <div>
                                          <div className="font-medium group-hover:text-primary transition-colors">
                                             {cat.name}
                                          </div>
                                       </div>
                                    </Link>
                                 ))}
                              </div>
                           </ScrollArea>
                        </div>
                     )}
                  </div>

                  <Link href="/">
                     <button className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                        Home
                     </button>
                  </Link>

                  <Link href="/products">
                     <button className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                        All Products
                     </button>
                  </Link>

                  <Link href="/categories">
                     <button className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                        All Categories
                     </button>
                  </Link>

                  {categories?.slice(0, 5).map((cat) => (
                     <Link
                        key={cat.id}
                        href={`/products/category/${cat.slug}`}>
                        <button className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                           {cat.name}
                        </button>
                     </Link>
                  ))}
               </div>

               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{storeInfo?.phone}</span>
               </div>
            </div>
         </div>
      </>
   );
}
