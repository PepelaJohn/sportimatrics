"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import {
  Heart,
  CreditCard,
  DollarSign,
  Gift,
  Loader,
  
} from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ERROR } from "@/constants";
import { CgPaypal } from "react-icons/cg";

export default function Donations() {
  const [selectedAmount, setSelectedAmount] = useState<Number | null>(5);
  const [customAmount, setCustomAmount] = useState<Number | null>(null);
  const [supporterCount, setSupporterCount] = useState(0);
  const user = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleDonate = async () => {
    console.log(user);
    let amount = customAmount || selectedAmount;

    if (!amount || !user.email) return;
    setLoading(true);
    try {
      const { data } = await axios.post("/api/donations?action=create-payment", {
        userId: user.email,
        amount,
      });
      window.location.href = data.link; // Redirect to PayPal payment page
    } catch (error: any) {
      dispatch({ type: ERROR, payload: "Error creating PayPal Payment" });
    }
    setLoading(false);
  };

  // Simulate fetch donation count on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setSupporterCount(Math.floor(Math.random() * 500) + 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const donationAmounts = [1, 2, 5, 10, 25];

  const handleCustomAmountChange = (e: any) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(value);
    if (value && !donationAmounts.includes(Number(value))) {
      setSelectedAmount(null);
    }
  };

  const handleAmountSelect = (amount: Number) => {
    setSelectedAmount(amount);
    setCustomAmount(null);
  };

  return (
    <div className="min-h-screen nav-height w-full flex flex-col items-center text-gray-100 bg-[#121626]">
      <Head>
        <title>Support MusiMeter | Donations</title>
        <meta
          name="description"
          content="Support the development of MusiMeter by making a donation"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-7xl w-full p-4 md:p-8 pt-16 flex flex-col items-center">
        {/* Header section - streamlined */}
        <div className="text-center w-full max-w-2xl mb-12">
       
          <h1 className="text-5xl font-bold mb-4 text-[#20E3B2]">MUSIMETER</h1>
       
          <p className="text-gray-400">
            Your donations help us maintain and improve MusiMeter, keeping it
            ad-free and continuously evolving with new features.
          </p>
        </div>

        {/* Main content - improved layout */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {/* Support stats panel */}
          <div className="bg-[#1A1F33] border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-[#1E2338] p-2 rounded-full mr-2">
                <Heart size={18} className="text-[#20E3B2]" />
              </span>
              Supporter Stats
            </h3>
            
            <p className="text-gray-300 mb-6">
              Join <span className="font-bold text-white-1">{supporterCount}</span> music lovers supporting MusiMeter
            </p>

            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Monthly Goal</span>
              <span className="text-white-1 font-medium">$1,500</span>
            </div>
            <div className="w-full bg-[#1E2338] rounded-full h-2 mb-4">
              <div
                className="bg-[#20E3B2] h-2 rounded-full"
                style={{ width: "65%" }}
              ></div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-[#20E3B2] font-medium">$975 raised</span>
              <span className="text-gray-400">65% of goal</span>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <h4 className="font-medium mb-3">Recent Supporters</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#1E2338] flex items-center justify-center text-[#20E3B2] mr-3">
                    A
                  </div>
                  <div>
                    <p className="text-white-1 text-sm">Alex S.</p>
                    <p className="text-gray-400 text-xs">$25 • 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#1E2338] flex items-center justify-center text-[#20E3B2] mr-3">
                    J
                  </div>
                  <div>
                    <p className="text-white-1 text-sm">Jamie K.</p>
                    <p className="text-gray-400 text-xs">$10 • 3 days ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#1E2338] flex items-center justify-center text-[#20E3B2] mr-3">
                    M
                  </div>
                  <div>
                    <p className="text-white-1 text-sm">Mike T.</p>
                    <p className="text-gray-400 text-xs">$50 • 5 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main donation card - central focus */}
          <div className="lg:col-span-2 bg-[#1A1F33] border border-gray-800 rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white-1 mb-6 flex items-center">
                <span className="bg-[#1E2338] p-2 rounded-full mr-2">
                  <DollarSign size={18} className="text-[#20E3B2]" />
                </span>
                Choose Your Donation
              </h2>

              {/* Donation amount selection - improved layout */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
                  {donationAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        selectedAmount === amount
                          ? "bg-[#20E3B2] text-[#121626] border border-[#20E3B2]"
                          : "bg-[#1E2338] text-gray-200 border border-gray-700 hover:border-[#20E3B2]"
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={customAmount as any}
                      onChange={handleCustomAmountChange}
                      placeholder="Enter custom amount"
                      className="bg-[#1E2338] border border-gray-700 rounded-lg py-3 pl-10 pr-4 block w-full focus:border-[#20E3B2] focus:outline-none text-white-1 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

        

              {/* Donation buttons - more prominent and clear */}
              <div className="space-y-4">
                <button
                  disabled={loading}
                  onClick={handleDonate}
                  className="w-full bg-[#20E3B2] disabled:bg-gray-700 hover:bg-[#1bc396] text-[#121626] rounded-lg py-4 px-6 font-bold flex items-center justify-center transition-colors duration-200"
                >
                  {loading ? (
                    <Loader className="text-[#121626] animate-spin" />
                  ) : (
                    <>
                      <CgPaypal className="mr-2 " size={30} />
                      Donate
                    </>
                  )}
                </button>
                <a
                  href="https://buymeacoffee.com/musimeter"
                  target="_blank"
                  className="w-full bg-[#1E2338] hover:bg-[#262c45] text-white-1 rounded-lg py-4 px-6 font-medium flex items-center justify-center transition-colors duration-200 border border-gray-700"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-2"
                  >
                    <path d="M7.5 2h9a1.5 1.5 0 0 1 1.5 1.5v2A1.5 1.5 0 0 1 16.5 7h-9A1.5 1.5 0 0 1 6 5.5v-2A1.5 1.5 0 0 1 7.5 2zm.5 9h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" />
                    <path d="M12 21.5c1.5 0 2-.5 2-2h-4c0 1.5.5 2 2 2zm2.3-13.5c1.2-.7 1.7-2.4.7-3.4-.9-1-2.5-.5-3.2.8 0 0-1.8 0-1.8 2-.1 2 4.3 0.6 4.3 0.6z" />
                  </svg>
                  Buy Me a Coffee
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits & Additional ways section - 2 column grid */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Benefits panel */}
          <div className="bg-[#1A1F33] border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-[#1E2338] p-2 rounded-full mr-2">
                <Gift size={18} className="text-[#20E3B2]" />
              </span>
              Why Support Us?
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-[#20E3B2]">✓</div>
                <p className="ml-3 text-gray-300">
                  Advanced music analytics features
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-[#20E3B2]">✓</div>
                <p className="ml-3 text-gray-300">
                  Ad-free experience forever
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-[#20E3B2]">✓</div>
                <p className="ml-3 text-gray-300">
                  Higher limits on music analysis
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-[#20E3B2]">✓</div>
                <p className="ml-3 text-gray-300">
                  Early access to new features
                </p>
              </li>
            </ul>

            {/* Additional ways integrated in the same card */}
            <div className="mt-8 pt-6 border-t border-gray-700 grid grid-cols-1 gap-4">
              <div className="flex gap-4 items-center">
                <Gift className="h-10 w-10 text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-1">Become a Patron</h3>
                  <p className="text-gray-300 text-sm mb-2">
                    Get exclusive benefits with monthly donations.
                  </p>
                  <a
                    href="#"
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Join on Patreon
                  </a>
                </div>
              </div>
              
              <div className="flex gap-4 items-center mt-2">
                <svg
                  className="h-10 w-10 text-green-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.486 2 2 6.486 2 12c0 4.42 2.865 8.166 6.84 9.49.5.09.68-.22.68-.485 0-.236-.008-.866-.013-1.7-2.782.603-3.37-1.34-3.37-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.07-.607.07-.607 1.004.07 1.532 1.03 1.532 1.03.89 1.53 2.34 1.09 2.91.833.09-.647.35-1.09.634-1.34-2.22-.252-4.555-1.112-4.555-4.943 0-1.09.39-1.984 1.03-2.682-.103-.254-.447-1.27.097-2.646 0 0 .84-.27 2.75 1.026.8-.223 1.654-.333 2.504-.337.85.004 1.705.114 2.504.337 1.91-1.294 2.748-1.026 2.748-1.026.546 1.376.202 2.394.1 2.646.64.7 1.026 1.59 1.026 2.682 0 3.84-2.337 4.687-4.565 4.935.36.308.678.92.678 1.852 0 1.336-.013 2.415-.013 2.75 0 .262.18.574.688.478C19.138 20.16 22 16.416 22 12c0-5.514-4.486-10-10-10z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Contribute Code</h3>
                  <p className="text-gray-300 text-sm mb-2">
                    Help improve MusiMeter by contributing to our repository.
                  </p>
                  <a
                    href="#"
                    className="inline-block bg-gray-700 hover:bg-gray-600 text-white-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    GitHub Repository
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials section - combined and focused */}
          <div className="bg-[#1A1F33] border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <span className="bg-[#1E2338] p-2 rounded-full mr-2">
                <svg className="h-5 w-5 text-[#20E3B2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
                </svg>
              </span>
              What Our Users Say
            </h2>
            
            <div className="space-y-6">
              <div className="bg-[#1E2338] border border-gray-700 rounded-lg p-4">
                <p className="text-gray-300 italic mb-4">
                &quot;MusiMeter has completely changed how I discover music. Their
                  analytics have shown me patterns in my listening I never noticed
                  before.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#1A1F33] flex items-center justify-center text-[#20E3B2] font-bold">
                    JD
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-white-1">Jamie D.</p>
                    <p className="text-sm text-gray-400">Supporter since 2023</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1E2338] border border-gray-700 rounded-lg p-4">
                <p className="text-gray-300 italic mb-4">
                &quot;I love having insights into my listening habits. The
                  visualizations are beautiful and the team is constantly adding
                  new features.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#1A1F33] flex items-center justify-center text-[#20E3B2] font-bold">
                    MK
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-white-1">Mira K.</p>
                    <p className="text-sm text-gray-400">Monthly supporter</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1E2338] border border-gray-700 rounded-lg p-4">
                <p className="text-gray-300 italic mb-4">
                &quot;The insights I get from MusiMeter have helped me expand my musical 
                  horizons. Worth every penny of support!&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#1A1F33] flex items-center justify-center text-[#20E3B2] font-bold">
                    TJ
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-white-1">Taylor J.</p>
                    <p className="text-sm text-gray-400">One-time donor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}