'use client'
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const userId = searchParams.get("userId");
  const amount = searchParams.get("amount");
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transactionId && userId && amount) {
      setIsLoading(true);
      axios.post("/api/donations?action=donate", { 
        userId, 
        transactionId, 
        amount, 
        status: "completed" 
      })
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          setError("There was a problem recording your donation.");
          setIsLoading(false);
          console.error(err);
        });
    }
  }, [transactionId, userId, amount]);

  return (
    <div className="min-h-screen  text-white-1 flex items-center justify-center p-4">
      <div className="bg-black bg-opacity-60 rounded-xl shadow-2xl p-8 max-w-md w-full backdrop-blur-sm border border-green-500 border-opacity-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-green-300">Processing your donation...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="text-red-400 text-xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-red-400 mb-2">Oops!</h1>
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => router.push("/dashboard")} 
              className="mt-4 bg-green-500 hover:bg-green-600 text-white-1 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-green-500/30"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-green-400 text-5xl mb-6">✓</div>
            <h1 className="text-2xl md:text-3xl font-bold text-green-400 mb-2">Amazing!</h1>
            <h2 className="text-xl font-bold text-green-300 mb-4">Thank you for your donation!</h2>
            
            {amount && (
              <div className="bg-green-900 bg-opacity-40 rounded-lg p-4 mb-6">
                <p className="text-3xl font-bold text-green-300">${amount}</p>
                <p className="text-green-400 text-sm">Successfully processed</p>
              </div>
            )}
            
            <p className="mb-6 text-gray-300">Your PayPal donation has been recorded and is greatly appreciated.</p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push("/")} 
                className="bg-green-500 hover:bg-green-600 text-white-1 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-green-500/30 flex items-center justify-center"
              >
                <span>Go to Dashboard</span>
              </button>
              <button 
                onClick={() => router.push("/donate")} 
                className="bg-transparent hover:bg-green-800 border border-green-500 text-green-400 px-6 py-3 rounded-full font-medium transition-all duration-300"
              >
                Donate Again
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-green-900">
              <p className="text-sm text-gray-400">Transaction ID: {transactionId ? (transactionId as string).substring(0, 8) + "..." : "Processing"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;