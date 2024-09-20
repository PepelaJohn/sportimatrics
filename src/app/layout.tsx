import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/redux/store/StoreProvider";
import Alert from "@/components/Alert"
const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Musimter",
  description: "Keep Track of your Spotify Listening History",
  icons: {
    icon: "/icons/logo.png",
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
          <StoreProvider>{children}
            
          </StoreProvider>
        </body>
      </>
    </html>
  );
}
