"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store";

interface SeoProps {
   metaTitle?: string;
   metaDescription?: string;
   metaTags?: string[];
   schema?: string | object;
}

interface Props {
   storeData?: SeoProps;
}

export const Seo: React.FC<Props> = ({ storeData: pageSeo }) => {
   const { storeData: globalStore } = useSelector((state: RootState) => state.store);

   useEffect(() => {
      // 1. Determine Title
      const title = pageSeo?.metaTitle || globalStore?.metaTitle || globalStore?.name || "Z Bazar BD";
      document.title = title;

      // 2. Determine Description
      const description = pageSeo?.metaDescription || globalStore?.metaDescription || globalStore?.description || "";
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
         metaDescription = document.createElement('meta');
         metaDescription.setAttribute('name', 'description');
         document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);

      // 3. Determine Keywords
      const keywords = (pageSeo?.metaTags || globalStore?.metaTags || []).join(", ");
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
         metaKeywords = document.createElement('meta');
         metaKeywords.setAttribute('name', 'keywords');
         document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);

      // 4. OG Title
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', title);

      // 5. OG Description
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);

   }, [pageSeo, globalStore]);

   return null;
};
