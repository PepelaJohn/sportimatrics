import Footer from "@/components/Footer";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
   <>
    <div className="relative flex flex-col">
      <main className="relative flex bg-black-3">
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
