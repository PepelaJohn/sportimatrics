import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/Navbar";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SpotiMetrics",
  description: "Keep Track of your Spotify Listening History",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <>
        <body className={`${manrope.className}`}>
         
          {children}
        </body>
      </>
    </html>
  );
}
