import Footer from "@/components/Footer";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
   <>
    <div className="relative flex flex-col bg-gradient-to-r from-green-500/20 to-blue-500/20 animate-pulse-slow">
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
