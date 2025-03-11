import Footer from "@/components/Footer";
import { Loader } from "lucide-react";
import { Suspense } from "react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
//bg-gradient-to-r
  return (
   <>
    <div className="relative flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black animate-pulse-slow">
      <main className="relative flex ">
        <section className="flex min-h-screen  flex-1 flex-col ">
          <div className="mx-auto flex w-full h-full flex-col ">
           
            <div className="flex flex-col h-full">{children}</div>
            
          </div>
        </section>
        
      </main>
    </div>
    <Footer/>
   </>
  );
}
