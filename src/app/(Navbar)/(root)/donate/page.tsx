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

export default function Donations() {
  const [selectedAmount, setSelectedAmount] = useState<Number | null>(5);
  const [customAmount, setCustomAmount] = useState<Number | null>(null);
  const [supporterCount, setSupporterCount] = useState(0);
  const user = useSelector((state: any) => state.user);
  // const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const handleDonate = async () => {
    console.log(user)
    let amount = customAmount || selectedAmount

    if (!amount || !user.email) return
    setLoading(true);
    try {
      const { data } = await axios.post("/api/donations?action=create-payment", {
        userId: user.email,
        amount,
      });
      window.location.href = data.link; // Redirect to PayPal payment page
    } catch (error:any) {
       dispatch({ type: ERROR, payload: "Error creating PayPal Payment" });
      
      // alert("Failed to start payment.");
    }
    setLoading(false);
  };
  // Simulate fetch donation count on mount
  useEffect(() => {
    // This would be replaced with an actual API call
    const timer = setTimeout(() => {
      setSupporterCount(Math.floor(Math.random() * 500) + 200);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const donationAmounts = [1,2,5, 10, 25,];

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
    <div className="min-h-screen nav-height  w-full bg-[#121626] flex flex-col items-center text-gray-100">
      <Head>
        <title>Support MusiMeter | Donations</title>
        <meta
          name="description"
          content="Support the development of MusiMeter by making a donation"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-7xl w-full p-4 md:p-8 pt-16 flex flex-col ">
        {/* Header section similar to homepage */}
        <div className="text-left w-full max-w-4xl  mb-16">
          <div className="text-[#20E3B2] text-sm font-medium mb-2">
            YOUR SUPPORT OPTIONS
          </div>
          <h1 className="text-6xl font-bold mb-4 text-[#20E3B2]">MUSIMETER</h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-2">
            Support our mission to uncover your listening patterns and discover
            your musical identity.
          </p>
          <p className="text-gray-400 max-w-2xl">
            Your donations help us maintain and improve MusiMeter, keeping it
            ad-free and continuously evolving with new features.
          </p>
        </div>

        {/* Main section */}
        <div className="w-full flex flex-col md:flex-row gap-8 mb-16">
          {/* Left column - main donation card */}
          <div className="w-full md:w-2/3">
            <div className="bg-[#1A1F33] border border-gray-800 rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Choose a Donation Amount
                </h2>

                {/* Donation amount selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Select Amount
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
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
                        className="bg-[#1E2338] border border-gray-700 rounded-lg py-3 pl-10 pr-4 block w-full focus:border-[#20E3B2] focus:outline-none text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment methods */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white mb-3">
                    Payment Methods
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-[#1E2338] p-3 rounded-lg flex items-center space-x-2 border border-gray-700">
                      <CreditCard size={20} className="text-gray-300" />
                      <span className="text-gray-300">Credit Card</span>
                    </div>
                    <div className="bg-[#1E2338] p-3 rounded-lg flex items-center space-x-2 border border-gray-700">
                      <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        className="text-gray-300 fill-current"
                      >
                        <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 4.084-.022.114a.804.804 0 0 1-.794.68h-2.52c-.092 0-.092-.063-.092-.18v-.13c0-.126.02-.147.09-.207.075-.063.13-.116.196-.18.07-.067.12-.13.19-.27.07-.133.105-.297.15-.52l1.108-7.03c.06-.38.504-.663.884-.663h.34c3.58 0 6.4-1.49 7.23-5.744.28-1.422.134-2.62-.894-3.45-.88-.698-1.398-.93-2.218-1.092-.738-.148-1.572-.195-2.52-.195H6.41c-.32 0-.63.15-.746.438L1.31 23.37c-.032.085-.065.148-.065.21 0 .097.064.183.195.183h4.47c.384 0 .697-.32.752-.696l.037-.188.704-4.46.045-.228c.055-.378.367-.697.75-.697h.553c3.04 0 5.4-1.255 6.1-4.883.335-1.77.132-3.217-1.097-4.24-.38-.32-.855-.575-1.41-.765.13-.02.25-.04.38-.06.738-.116 1.537-.116 2.37 0 .854.117 1.398.35 1.97.76v.002z" />
                      </svg>
                      <span className="text-gray-300">PayPal</span>
                    </div>
                    <div className="bg-[#1E2338] p-3 rounded-lg flex items-center space-x-2 border border-gray-700">
                      <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        className="text-gray-300 fill-current"
                      >
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                        <path
                          fill="#1E2338"
                          d="M9.8 14.9l-2.8-2.9 1-1 1.8 1.9 4.2-4.2 1 1z"
                        />
                      </svg>
                      <span className="text-gray-300">Crypto</span>
                    </div>
                  </div>
                </div>

                {/* Donation button */}
                <div className="flex flex-col gap-4">
                  <button
                  disabled={loading}
                    onClick={handleDonate}
                    className="w-full bg-[#20E3B2] disabled:bg-gray-700 hover:bg-[#1bc396] text-[#121626] rounded-lg py-4 px-6 font-bold flex items-center justify-center transition-colors duration-200"
                  >
                  {
                    loading ? <Loader rotate={2} className="text-green-500 "></Loader> : <>  <Heart className="mr-2" size={20} />
                    Support MusiMeter</>
                  }
                  </button>
                  <a
                    href="https://buymeacoffee.com/musimeter"
                    target="_blank"
                    className="w-full bg-[#1E2338] hover:bg-[#262c45] text-white rounded-lg py-4 px-6 font-medium flex items-center justify-center transition-colors duration-200 border border-gray-700"
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

          {/* Right column - supporter info */}
          <div className="w-full md:w-1/3">
            <div className="bg-[#1A1F33] border border-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Supporter Stats</h3>
              <p className="text-gray-300 mb-6">
                Join {supporterCount} music lovers supporting MusiMeter
              </p>

              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Monthly Goal</span>
                <span className="text-white font-medium">$1,500</span>
              </div>
              <div className="w-full bg-[#1E2338] rounded-full h-2 mb-6">
                <div
                  className="bg-[#20E3B2] h-2 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>

              <div className="flex items-center justify-between mb-4">
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
                      <p className="text-white text-sm">Alex S.</p>
                      <p className="text-gray-400 text-xs">$25 • 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#1E2338] flex items-center justify-center text-[#20E3B2] mr-3">
                      J
                    </div>
                    <div>
                      <p className="text-white text-sm">Jamie K.</p>
                      <p className="text-gray-400 text-xs">$10 • 3 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#1E2338] flex items-center justify-center text-[#20E3B2] mr-3">
                      M
                    </div>
                    <div>
                      <p className="text-white text-sm">Mike T.</p>
                      <p className="text-gray-400 text-xs">$50 • 5 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1F33] border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Why Support Us?</h3>
              <ul className="space-y-3">
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
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="w-full  mb-16 flex items-center flex-col ">
          <h2 className="text-3xl font-bold mb-8 text-center">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 max-w-4xl md:grid-cols-2 gap-6">
            <div className="bg-[#1A1F33] border border-gray-800 rounded-lg p-6">
              <p className="text-gray-300 italic mb-4">
                "MusiMeter has completely changed how I discover music. Their
                analytics have shown me patterns in my listening I never noticed
                before."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#1E2338] flex items-center justify-center text-[#20E3B2] font-bold">
                  JD
                </div>
                <div className="ml-3">
                  <p className="font-medium text-white">Jamie D.</p>
                  <p className="text-sm text-gray-400">Supporter since 2023</p>
                </div>
              </div>
            </div>
            <div className="bg-[#1A1F33] border border-gray-800 rounded-lg p-6">
              <p className="text-gray-300 italic mb-4">
                "I love having insights into my listening habits. The
                visualizations are beautiful and the team is constantly adding
                new features."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#1E2338] flex items-center justify-center text-[#20E3B2] font-bold">
                  MK
                </div>
                <div className="ml-3">
                  <p className="font-medium text-white">Mira K.</p>
                  <p className="text-sm text-gray-400">Monthly supporter</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          {/* Additional ways to support */}
          <div className="w-full max-w-2xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <Gift className="h-10 w-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Become a Patron</h3>
              <p className="text-gray-300 mb-4">
                Get exclusive benefits with monthly donations through Patreon.
              </p>
              <a
                href="#"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                Join on Patreon
              </a>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <svg
                className="h-10 w-10 text-green-400 mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.486 2 2 6.486 2 12c0 4.42 2.865 8.166 6.84 9.49.5.09.68-.22.68-.485 0-.236-.008-.866-.013-1.7-2.782.603-3.37-1.34-3.37-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.07-.607.07-.607 1.004.07 1.532 1.03 1.532 1.03.89 1.53 2.34 1.09 2.91.833.09-.647.35-1.09.634-1.34-2.22-.252-4.555-1.112-4.555-4.943 0-1.09.39-1.984 1.03-2.682-.103-.254-.447-1.27.097-2.646 0 0 .84-.27 2.75 1.026.8-.223 1.654-.333 2.504-.337.85.004 1.705.114 2.504.337 1.91-1.294 2.748-1.026 2.748-1.026.546 1.376.202 2.394.1 2.646.64.7 1.026 1.59 1.026 2.682 0 3.84-2.337 4.687-4.565 4.935.36.308.678.92.678 1.852 0 1.336-.013 2.415-.013 2.75 0 .262.18.574.688.478C19.138 20.16 22 16.416 22 12c0-5.514-4.486-10-10-10z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Contribute Code</h3>
              <p className="text-gray-300 mb-4">
                Help improve SpotiMetrics by contributing to our open source
                code.
              </p>
              <a
                href="#"
                className="inline-block bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                GitHub Repository
              </a>
            </div>
          </div>

         
        </div>
      </main>
    </div>
  );
}
