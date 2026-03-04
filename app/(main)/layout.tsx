"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartSheet } from "@/components/cart/CartSheet";
import FloatingContact from "@/components/layout/FloatingContact";
import { MarketingPopup } from "@/components/marketing/MarketingPopup";
import { HeaderBanner } from "@/components/marketing/HeaderBanner";
import { Seo } from "@/seo/Seo";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="page-ani pb-16 lg:pb-0">
            <Seo />
            <HeaderBanner />
            <Header />
            {children}
            <Footer />
            <MobileNav />
            <CartSheet />
            <FloatingContact />
            <MarketingPopup />
        </div>
    );
}
