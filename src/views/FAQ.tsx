"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
   Search,
   ChevronDown,
   Package,
   Truck,
   Wallet,
   Ruler,
   RefreshCcw,
   HelpCircle,
} from "lucide-react";
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

import { useSelector } from "react-redux";
import { RootState } from "@/redux-store";
import { Seo } from "@/seo/Seo";

const faqCategories = [
   {
      id: "orders",
      title: "Ordering & Tracking",
      icon: <Package className="h-5 w-5" />,
      questions: [
         {
            q: "How do I place an order?",
            a: "Placing an order is simple! Browse our collection, select your favorite sneakers and size, click 'Add to Cart', and then proceed to 'Checkout'. Follow the prompts to provide your delivery details and choose a payment method. Once confirmed, you'll receive an order confirmation via email and SMS.",
         },
         {
            q: "Can I change or cancel my order after placing it?",
            a: "We process orders quickly to ensure fast delivery. You can change or cancel your order within 1 hour of placing it by contacting our support team. Once the order has been dispatched, we cannot cancel it, but you can initiate a return or exchange after receiving it.",
         },
         {
            q: "How can I track my order status?",
            a: "After your order is shipped, we will send you a tracking number via SMS and email. You can use this number on our 'Track Order' page or the courier's website to see the real-time status of your package.",
         },
      ],
   },
   {
      id: "shipping",
      title: "Shipping & Delivery",
      icon: <Truck className="h-5 w-5" />,
      questions: [
         {
            q: "What are your shipping charges in Bangladesh?",
            a: "We offer standard shipping across Bangladesh. For deliveries inside Dhaka, the charge is usually BDT 60-80. For locations outside Dhaka, it ranges from BDT 120-150. Look out for seasonal 'Free Shipping' offers on orders above a certain amount!",
         },
         {
            q: "How long does delivery take?",
            a: "Typically, deliveries inside Dhaka take 24-48 hours. For outside Dhaka, it usually takes 3-5 business days. During peak sale periods or extreme weather conditions, there might be slight delays, and we appreciate your patience.",
         },
         {
            q: "Do you offer home delivery?",
            a: "Yes, we provide door-to-door home delivery across all 64 districts of Bangladesh through our reliable courier partners.",
         },
      ],
   },
   {
      id: "payments",
      title: "Payment Methods",
      icon: <Wallet className="h-5 w-5" />,
      questions: [
         {
            q: "What payment options do you accept?",
            a: "We accept various payment methods including Cash on Delivery (COD), bKash, Nagad, and major Credit/Debit Cards (Visa, Mastercard, Amex). Online payments are processed through a secure SSL-encrypted gateway.",
         },
         {
            q: "Is Cash on Delivery available everywhere?",
            a: "Yes, Cash on Delivery is available nationwide. Please note that for some high-value items or remote locations, we might request a small partial advance via bKash to confirm the order.",
         },
      ],
   },
   {
      id: "sizing",
      title: "Sizing & Authenticity",
      icon: <Ruler className="h-5 w-5" />,
      questions: [
         {
            q: "How do I find my correct sneaker size?",
            a: "We provide a detailed Size Guide on every product page. Sneaker sizing can vary slightly between brands (e.g., Nike vs. Adidas). If you're unsure, we recommend measuring your foot in centimeters and matching it with our guide.",
         },
         {
            q: "Are the sneakers original and authentic?",
            a: "Absolutely! We take pride in offering only 100% authentic sneakers sourced directly from authorized distributors or the brands themselves. Every pair comes in its original box with all accompanying tags.",
         },
      ],
   },
   {
      id: "returns",
      title: "Returns & Exchanges",
      icon: <RefreshCcw className="h-5 w-5" />,
      questions: [
         {
            q: "What is your return/exchange policy?",
            a: "We offer a 7-day hassle-free exchange policy. If the sneakers don't fit or you're not satisfied, you can exchange them for a different size or another model, provided they are in brand-new, unworn condition with all tags and original packaging.",
         },
         {
            q: "How do I initiate a return?",
            a: "To start a return or exchange, please contact our support team via WhatsApp or call our hotline. You'll need to provide your order number and photos of the product condition. Once approved, you can send the item back to our warehouse.",
         },
      ],
   },
];

export default function FAQ() {
   const { storeData } = useSelector((state: RootState) => state.store);
   const [searchQuery, setSearchQuery] = useState("");

   const filteredFaqs = faqCategories
      .map((cat) => ({
         ...cat,
         questions: cat.questions.filter(
            (q) =>
               q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
               q.a.toLowerCase().includes(searchQuery.toLowerCase()),
         ),
      }))
      .filter((cat) => cat.questions.length > 0);

   return (
      <div className="min-h-screen bg-background pb-20">
         <Seo
            storeData={{
               metaTitle: `FAQ | ${storeData.name || "ZBazar"}`,
               metaDescription: `Frequently Asked Questions about ordering, shipping, payments, and returns at ${storeData.name}.`,
               metaTags: ["FAQ", "Help", "Support", "Shipping Bangladesh", "Sneaker Sizing"],
            }}
         />

         {/* Hero Section */}
         <section className="bg-foreground text-background py-16 lg:py-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

            <div className="container relative z-10 text-center">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help Center</span>
               </motion.div>
               <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6">
                  How can we <span className="text-primary italic">help you?</span>
               </motion.h1>

               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-xl mx-auto relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                     type="text"
                     placeholder="Search for questions (e.g. shipping, size, bKash)..."
                     className="h-14 pl-12 pr-4 text-lg bg-background text-foreground border-none shadow-2xl rounded-2xl focus-visible:ring-2 focus-visible:ring-primary"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </motion.div>
            </div>
         </section>

         <div className="container mt-12 lg:mt-20 max-w-4xl">
            {filteredFaqs.length > 0 ? (
               <div className="space-y-12">
                  {filteredFaqs.map((category, idx) => (
                     <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="space-y-4">
                        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border/50">
                           <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              {category.icon}
                           </div>
                           <h2 className="text-2xl font-bold">{category.title}</h2>
                        </div>

                        <Accordion
                           type="single"
                           collapsible
                           className="w-full space-y-3">
                           {category.questions.map((faq, qIdx) => (
                              <AccordionItem
                                 key={qIdx}
                                 value={`${category.id}-${qIdx}`}
                                 className="border border-border/60 rounded-xl px-4 bg-card/50 hover:bg-card transition-colors shadow-sm">
                                 <AccordionTrigger className="text-left py-4 hover:no-underline font-semibold text-lg gap-4">
                                    {faq.q}
                                 </AccordionTrigger>
                                 <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-4">
                                    {faq.a}
                                 </AccordionContent>
                              </AccordionItem>
                           ))}
                        </Accordion>
                     </motion.div>
                  ))}
               </div>
            ) : (
               <div className="text-center py-20 px-4">
                  <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No results found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                     We couldn't find any answers for "
                     <span className="font-semibold">{searchQuery}</span>". Try different keywords
                     or contact us directly.
                  </p>
               </div>
            )}

            {/* Contact Support CTA */}
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="mt-20 p-8 rounded-3xl bg-primary text-primary-foreground text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-12 -translate-y-12" />
               <h3 className="text-2xl font-bold mb-4 relative z-10">Still have questions?</h3>
               <p className="mb-8 opacity-90 relative z-10 max-w-md mx-auto">
                  If you couldn't find what you were looking for, our customer support team is ready
                  to help you directly.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                  <a
                     href="/contact"
                     className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-sm font-semibold text-primary transition-colors hover:bg-white/90 shadow-lg">
                     Contact Support
                  </a>
                  {storeData?.phone && (
                     <a
                        href={`tel:${storeData.phone}`}
                        className="inline-flex h-12 items-center justify-center rounded-xl border border-white/30 px-8 text-sm font-semibold transition-colors hover:bg-white/10">
                        Call {storeData.phone}
                     </a>
                  )}
               </div>
            </motion.div>
         </div>
      </div>
   );
}
