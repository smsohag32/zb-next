import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileNav } from "./MobileNav";
import { CartSheet } from "../cart/CartSheet";
import FloatingContact from "./FloatingContact";

import { MarketingPopup } from "../marketing/MarketingPopup";
import { HeaderBanner } from "../marketing/HeaderBanner";

const MainLayout = ({ children }: { children: ReactNode }) => {
   return (
      <div className="page-ani pb-16 lg:pb-0">
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
};

export default MainLayout;
