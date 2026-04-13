import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: {
        default: "Z Bazar BD | Best Online Footwear Shop in Bangladesh",
        template: "%s | Z Bazar BD",
    },
    description: "Z Bazar BD (Zbazar) is the leading online footwear shop in Bangladesh. Shop premium quality sneakers, formal shoes, sandals, and casual footwear for men and women at the best prices with fast home delivery.",
    keywords: ["Z Bazar BD", "Zbazar", "Z Bazar footwear Bangladesh", "shoes online BD", "online shoe store Bangladesh", "buy shoes online Bangladesh", "sneakers online Bangladesh", "formal shoes Bangladesh", "casual shoes BD online", "leather shoes Bangladesh"],
    authors: [{ name: "Z Bazar BD" }],
    metadataBase: new URL("https://zbazarbd.com"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "Z Bazar BD | Best Online Footwear Shop in Bangladesh",
        description: "Discover the best footwear collection at Z Bazar BD. Shop premium sneakers, formal shoes, and sandals for men and women in Bangladesh.",
        type: "website",
        url: "https://zbazarbd.com",
        images: [
            {
                url: "https://zbazarbd.com/web-app-manifest-512x512.png",
                width: 512,
                height: 512,
                alt: "Z Bazar BD Logo",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Z Bazar BD | Best Online Shoes in BD",
        description: "Premium footwear collection for men and women at Z Bazar BD (Zbazar). Fast delivery nationwide.",
        images: ["https://zbazarbd.com/web-app-manifest-512x512.png"],
        site: "@zbazarbd",
    },
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
            { url: "/favicon.svg", type: "image/svg+xml" },
        ],
        apple: "/web-app-manifest-192x192.png",
    },
    manifest: "/site.webmanifest",
};

export const viewport = {
    themeColor: "#000000",
};

const roboto = Roboto({
    weight: ["100", "300", "400", "500", "700", "900"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className={`${roboto.variable}`}>
            <head>
                {/* Google Tag Manager */}
                <Script id="gtm-script" strategy="lazyOnload">
                    {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-NFTV34J4');`}
                </Script>
            </head>
            <body>
                {/* Google Tag Manager (noscript) */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-NFTV34J4"
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                    />
                </noscript>
                <Providers>
                    <Toaster />
                    <Sonner position="top-right" duration={3000} />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
