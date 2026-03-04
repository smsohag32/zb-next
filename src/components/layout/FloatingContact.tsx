"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store";
import Link from "next/link";

const FloatingContact: React.FC = () => {
   const [isOpen, setIsOpen] = useState(true);
   const { storeData } = useSelector((state: RootState) => state.store);

   const toggleOpen = () => setIsOpen(!isOpen);
   const lastScrollY = React.useRef(0);
   const [hasAutoOpened, setHasAutoOpened] = useState(false);

   // Extract Facebook username/ID for Messenger
   const getMessengerLink = () => {
      const fbUrl = storeData?.socials?.facebook;
      if (!fbUrl) return "#";

      try {
         if (fbUrl.includes("m.me")) return fbUrl;

         let handle = fbUrl;
         if (fbUrl.includes("facebook.com")) {
            const url = new URL(fbUrl.startsWith("http") ? fbUrl : `https://${fbUrl}`);
            handle =
               url.pathname
                  .split("/")
                  .filter((p) => p)
                  .pop() || "";
            if (handle === "profile.php") {
               const id = url.searchParams.get("id");
               handle = id || "";
            }
         }

         return handle ? `https://m.me/${handle}` : fbUrl;
      } catch (e) {
         return fbUrl;
      }
   };

   const whatsappNumber = storeData?.phone?.replace(/\D/g, "");
   const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "#";
   const messengerLink = getMessengerLink();

   const socialButtons = [
      {
         id: "whatsapp",
         name: "WhatsApp",
         label: "Chat on WhatsApp",
         icon: (
            <svg
               viewBox="0 0 24 24"
               width="26"
               height="26"
               fill="currentColor">
               <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
         ),
         color: "bg-[#25D366]",
         href: whatsappLink,
      },
      {
         id: "messenger",
         name: "Messenger",
         label: "Message on Messenger",
         icon: (
            <svg
               viewBox="0 0 24 24"
               width="26"
               height="26"
               fill="currentColor">
               <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.303 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.733l-3.067-3.274-5.986 3.274 6.586-6.989L13.89 11l5.987-3.275-6.586 7.008z" />
            </svg>
         ),
         color: "bg-[#0084FF]",
         href: messengerLink,
      },
      {
         id: "contact-page",
         name: "Contact Page",
         label: "Visit Contact Page",
         icon: <MessageCircle size={26} />,
         color: "bg-primary",
         href: "/contact",
         isInternal: true,
      },
   ];

   const containerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
         },
      },
      exit: {
         opacity: 0,
         transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
         },
      },
   };

   const buttonVariants: Variants = {
      hidden: { y: 20, opacity: 0, scale: 0.8 },
      visible: {
         y: 0,
         opacity: 1,
         scale: 1,
         transition: { type: "spring" as const, stiffness: 260, damping: 20 },
      },
      exit: {
         y: 20,
         opacity: 0,
         scale: 0.8,
         transition: { duration: 0.2 },
      },
   };

   return (
      <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6  z-[999] flex flex-col items-end gap-4">
         <AnimatePresence>
            {isOpen && (
               <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-end gap-2">
                  {socialButtons.map((btn) => (
                     <motion.div
                        key={btn.id}
                        variants={buttonVariants}
                        className="group relative flex items-center">
                        {/* Label */}
                        <span className="hidden lg:block mr-3 whitespace-nowrap rounded-lg bg-card px-3 py-1.5 text-sm font-medium text-foreground opacity-0 shadow-md ring-1 ring-border transition-all duration-300 group-hover:opacity-100 dark:bg-zinc-900">
                           {btn.label}
                        </span>

                        {/* Button */}
                        {btn.isInternal ? (
                           <Link
                              href={btn.href}
                              onClick={() => setIsOpen(false)}
                              className={`flex h-14 w-14 items-center justify-center rounded-full ${btn.color} text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                              aria-label={btn.label}
                              title={btn.name}>
                              {btn.icon}
                           </Link>
                        ) : (
                           <a
                              href={btn.href}
                              target="_blank"
                              rel="noreferrer"
                              className={`flex h-14 w-14 items-center justify-center rounded-full ${btn.color} text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                              aria-label={btn.label}
                              title={btn.name}>
                              {btn.icon}
                           </a>
                        )}
                     </motion.div>
                  ))}
               </motion.div>
            )}
         </AnimatePresence>

         {/* Main Toggle Button */}
         <div className="relative">
            <motion.button
               onClick={toggleOpen}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white transition-all duration-500 focus:outline-none hover:bg-red-700 ${
                  isOpen ? "rotate-180 shadow-md" : "shadow-lg"
               }`}
               aria-expanded={isOpen}
               aria-label={isOpen ? "Close contact options" : "Open contact options"}>
               <AnimatePresence mode="wait">
                  {isOpen ? (
                     <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}>
                        <X
                           size={30}
                           strokeWidth={2.5}
                        />
                     </motion.div>
                  ) : (
                     <motion.div
                        key="message"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}>
                        <MessageCircle
                           size={28}
                           strokeWidth={2.5}
                        />
                     </motion.div>
                  )}
               </AnimatePresence>
            </motion.button>
         </div>
      </div>
   );
};

export default FloatingContact;
