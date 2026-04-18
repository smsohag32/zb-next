"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux-store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import logo from "@/assets/logo2.png";
import Logo from "@/assets/Logo";

const footerLinks = {
   support: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Privacy & Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-conditions" },
   ],
};

export function Footer() {
   const { storeData } = useSelector((state: RootState) => state.store);
   const { categories } = useSelector((state: RootState) => state.category);
   const footerCategories = categories?.slice(0, 6) || [];

   return (
      <footer className="bg-[#f2f0eff6] dark:bg-card dark:text-card-foreground text-foreground border-t border-border/40">
         <div className="container py-12 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-4">
               {/* Brand */}
               <div className="lg:col-span-2">
                  <Logo />
                  <p className="mt-4 dark:text-accent-foreground/80 text-foreground/70 max-w-sm">
                     {storeData?.description ||
                        "Your one-stop shop for everything trendy and essential."}
                  </p>
                  <div className="mt-6 space-y-2">
                     {storeData?.email && (
                        <a
                           href={`mailto:${storeData.email}`}
                           className="flex items-center text-sm dark:text-accent-foreground/80 text-foreground/70 hover:text-foreground dark:hover:text-accent-foreground transition-colors">
                           <Mail className="h-4 w-4 mr-2" /> {storeData.email}
                        </a>
                     )}
                     {storeData?.phone && (
                        <a
                           href={`tel:${storeData.phone}`}
                           className="flex items-center text-sm dark:text-accent-foreground/80 text-foreground/70 hover:text-foreground dark:hover:text-accent-foreground transition-colors">
                           <Phone className="h-4 w-4 mr-2" /> {storeData.phone}
                        </a>
                     )}
                  </div>
               </div>

               {/* Links - Shop */}
               <div>
                  <h4 className="font-semibold mb-4">Shop</h4>
                  <ul className="space-y-3">
                     {footerCategories.map((category) => (
                        <li key={category.id}>
                           <Link
                              href={`/products?category=${category.slug}`}
                              className="text-foreground/70 dark:text-card-foreground/80 hover:text-foreground dark:hover:text-card-foreground transition-colors">
                              {category.name}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>

               {/* Links - Support */}
               <div>
                  <h4 className="font-semibold mb-4">Support</h4>
                  <ul className="space-y-3">
                     {footerLinks.support.map((link) => (
                        <li key={link.href}>
                           <Link
                              href={link.href}
                              className="text-foreground/70 dark:text-card-foreground/80 hover:text-foreground dark:hover:text-card-foreground transition-colors">
                              {link.label}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            <Separator className="my-8 bg-border dark:bg-card-foreground/20" />

            {/* Bottom */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
               <TooltipProvider>
                  <div className="flex items-center gap-4">
                     {storeData?.socials?.facebook && (
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <a
                                 href={storeData.socials.facebook}
                                 target="_blank"
                                 rel="noreferrer"
                                 className="text-foreground/70 dark:text-card-foreground/80 hover:text-foreground dark:hover:text-card-foreground transition-colors"
                                 aria-label="Facebook">
                                 <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-5 w-5">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                 </svg>
                              </a>
                           </TooltipTrigger>
                           <TooltipContent>Facebook</TooltipContent>
                        </Tooltip>
                     )}
                     {storeData?.socials?.instagram && (
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <a
                                 href={storeData.socials.instagram}
                                 target="_blank"
                                 rel="noreferrer"
                                 className="text-foreground/70 dark:text-card-foreground/80 hover:text-foreground dark:hover:text-card-foreground transition-colors"
                                 aria-label="Instagram">
                                 <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5">
                                    <rect
                                       x="2"
                                       y="2"
                                       width="20"
                                       height="20"
                                       rx="5"
                                       ry="5"
                                    />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line
                                       x1="17.5"
                                       y1="6.5"
                                       x2="17.51"
                                       y2="6.5"
                                    />
                                 </svg>
                              </a>
                           </TooltipTrigger>
                           <TooltipContent>Instagram</TooltipContent>
                        </Tooltip>
                     )}
                     {storeData?.socials?.twitter && (
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <a
                                 href={storeData.socials.twitter}
                                 target="_blank"
                                 rel="noreferrer"
                                 className="text-foreground/70 dark:text-card-foreground/80 hover:text-foreground dark:hover:text-card-foreground transition-colors"
                                 aria-label="X (formerly Twitter)">
                                 <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-5 w-5">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                 </svg>
                              </a>
                           </TooltipTrigger>
                           <TooltipContent>Twitter / X</TooltipContent>
                        </Tooltip>
                     )}
                     {storeData?.socials?.youtube && (
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <a
                                 href={storeData.socials.youtube}
                                 target="_blank"
                                 rel="noreferrer"
                                 className="text-foreground/70 dark:text-card-foreground/80 hover:text-foreground dark:hover:text-card-foreground transition-colors"
                                 aria-label="YouTube">
                                 <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-5 w-5">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                 </svg>
                              </a>
                           </TooltipTrigger>
                           <TooltipContent>YouTube</TooltipContent>
                        </Tooltip>
                     )}
                     {storeData?.socials?.linkedin && (
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <a
                                 href={storeData.socials.linkedin}
                                 target="_blank"
                                 rel="noreferrer"
                                 className="text-foreground/70 dark:text-card-foreground/80 hover:text-foreground dark:hover:text-card-foreground transition-colors"
                                 aria-label="LinkedIn">
                                 <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-5 w-5">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                 </svg>
                              </a>
                           </TooltipTrigger>
                           <TooltipContent>LinkedIn</TooltipContent>
                        </Tooltip>
                     )}
                  </div>
               </TooltipProvider>
               <p className="text-sm text-foreground/60 dark:text-card-foreground/80">
                  © {new Date().getFullYear()}{" "}
                  <span className="font-medium">{storeData?.name || "ZBazar"}</span>. All rights
                  reserved.
               </p>
            </div>
         </div>
      </footer>
   );
}
