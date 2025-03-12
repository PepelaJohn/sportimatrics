import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/redux/store/StoreProvider";
import Script from "next/script";


const metadataBase =
  process.env.NODE_ENV === "production"
    ? new URL("https://musimeter.site")
    : new URL("http://localhost:3000"); // Handles local dev correctly

export const metadata: Metadata = {
  metadataBase,
  title: "Musimeter - Track Your Spotify Listening History",
  description: "Analyze and keep track of your Spotify listening habits with Musimeter.",
  keywords: ["Spotify history", "Spotify tracking", "music analytics", "listening habits"],
  authors: [
    { name: "Musimeter Team", url: "https://musimeter.site" },
    { name: "Musimeter on Instagram", url: "https://www.instagram.com/musimeter_official/" },
    { name: "Musimeter on Twitter", url: "https://x.com/musimeter_inc" },
  ],

  icons: {
    icon: "/icons/logoc.png",
  },
  openGraph: {
    title: "Musimeter - Track Your Spotify Listening History",
    description: "Analyze and keep track of your Spotify listening habits with Musimeter.",
    url: "https://musimeter.site",
    siteName: "Musimeter",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Musimeter - Keep Track of Your Spotify Listening History",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@musimeter", // Add your Twitter handle if available
    title: "Musimeter - Track Your Spotify Listening History",
    description: "Analyze and keep track of your Spotify listening habits with Musimeter.",
    images: ["/images/og-image.png"],
  },
  robots: "index, follow",
};

import GlobalLoader from '@/components/GlobalLoader'
import { Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head >

        {/* Google Analytics Script */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-F1FXGGN4KE`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body >
        <ErrorBoundary>
        <StoreProvider>
            <Suspense fallback={<GlobalLoader></GlobalLoader>}>

          {children}
            </Suspense>
          </StoreProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
