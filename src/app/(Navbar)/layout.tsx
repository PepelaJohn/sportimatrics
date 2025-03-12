import NavBar from "@/components/Navbar";
import CookieConsent from "@/components/CookieConsent";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      {children}
      <CookieConsent></CookieConsent>
    </>
  );
}
