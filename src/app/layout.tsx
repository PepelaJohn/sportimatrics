import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/redux/store/StoreProvider";

const manrope = Manrope({ subsets: ["latin"] });

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
    { name: "Musimeter on Instagram", url: "https://instagram.com/musimeter" },
    { name: "Musimeter on Twitter", url: "https://twitter.com/musimeter" },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className={manrope.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
