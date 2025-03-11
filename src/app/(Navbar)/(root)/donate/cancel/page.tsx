'use client'
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen  text-white-1 flex items-center justify-center p-4">
      <div className="bg-black bg-opacity-60 rounded-xl shadow-2xl p-8 max-w-md w-full backdrop-blur-sm border border-gray-500 border-opacity-20 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 bg-opacity-50 text-gray-400 text-3xl">
            ✕
          </div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-gray-300 mb-4">Payment Canceled</h1>
        
        <div className="bg-gray-800 bg-opacity-40 rounded-lg p-4 mb-6">
          <p className="text-gray-300">Your donation was not completed. No charges have been made to your account.</p>
        </div>
        
        <p className="mb-6 text-gray-400">If you canceled by mistake or would like to try again with a different payment method, you can use the button below.</p>
        
        <div className="flex flex-col gap-4 justify-center">
          <Button 
            onClick={() => router.push("/donate")} 
            className="bg-green-500 hover:bg-green-600 text-white-1 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-green-500/30 w-full"
          >
            Try Again
          </Button>
          
          <Button 
            onClick={() => router.push("/")} 
            className="bg-transparent hover:bg-gray-800 border border-gray-500 text-gray-300 px-6 py-3 rounded-full font-medium transition-all duration-300 w-full"
            variant="outline"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}