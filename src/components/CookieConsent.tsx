'use client'
import { getCookie } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Essential cookies are always required
    functional: false,
    analytics: false,
    marketing: false
  });
  const showCookieConsent = useSelector((state: {[key: string]: boolean}) => state.cookieselector);
  
  const loggedin = getCookie('_gtPaotwcsA')
  // Handle visibility based on Redux state
  useEffect(() => {
    if (showCookieConsent && !!loggedin) {
      setIsVisible(true);
      setIsAnimatingOut(false);
    }
  }, [showCookieConsent]);

  // Handle animation out completion
  const handleAnimationEnd = () => {
    if (isAnimatingOut) {
      setIsVisible(false);
    }
  };

  const handleCookieToggle = (cookieType: string) => {
    if (cookieType === 'essential') return; // Essential cookies can't be toggled
    setCookiePreferences({
      ...cookiePreferences,
      [cookieType]: !cookiePreferences[cookieType as keyof typeof cookiePreferences]
    });
  };

  const closeConsentBanner = (callback: () => void) => {
    setIsAnimatingOut(true);
    // Give the animation time to complete
    setTimeout(() => {
      callback();
    }, 300); // Animation duration
  };

  const acceptAll = () => {
    closeConsentBanner(() => {
      setCookiePreferences({
        essential: true,
        functional: true,
        analytics: true,
        marketing: true
      });
      // Add code to store consent
      localStorage.setItem('consent', 'true')
      console.log('All cookies accepted');
    });
  };

  const acceptSelected = () => {
    closeConsentBanner(() => {
      // Add code to store consent based on selection
      localStorage.setItem('consent', 'true')
      console.log('Selected cookies accepted:', cookiePreferences);
    });
  };

  const rejectNonEssential = () => {
    closeConsentBanner(() => {
      setCookiePreferences({
        essential: true,
        functional: false,
        analytics: false,
        marketing: false
      });
      // Add code to store consent
      console.log('Non-essential cookies rejected');
    });
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 w-full z-50 p-4 md:p-6 transition-transform duration-300 ease-in-out ${
        isAnimatingOut ? 'translate-y-full' : 'translate-y-0'
      }`}
      onTransitionEnd={handleAnimationEnd}
    >
      <div className="mx-auto max-w-6xl">
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-800">
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white-1 mb-2">Cookie Consent</h2>
              <p className="text-gray-400 text-sm md:text-base">
                We use cookies to enhance your experience, analyze site traffic, and personalize content.
                Essential cookies are always enabled as they are required for the website to function.
              </p>
            </div>
            
            {showDetails && (
              <div className="mb-6 border border-gray-700 rounded p-4 bg-gray-800">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white-1">Essential Cookies</h3>
                      <p className="text-xs text-gray-400">Required for basic website functionality</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={cookiePreferences.essential} 
                        disabled
                        className="w-10 h-5 bg-gray-700 rounded-full appearance-none cursor-not-allowed transition duration-200 checked:bg-green-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white-1">Functional Cookies</h3>
                      <p className="text-xs text-gray-400">Remember preferences and settings</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={cookiePreferences.functional} 
                        onChange={() => handleCookieToggle('functional')}
                        className="w-10 h-5 bg-gray-700 rounded-full appearance-none cursor-pointer transition duration-200 checked:bg-green-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white-1">Analytics Cookies</h3>
                      <p className="text-xs text-gray-400">Help us improve by tracking usage patterns</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={cookiePreferences.analytics} 
                        onChange={() => handleCookieToggle('analytics')}
                        className="w-10 h-5 bg-gray-700 rounded-full appearance-none cursor-pointer transition duration-200 checked:bg-green-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white-1">Marketing Cookies</h3>
                      <p className="text-xs text-gray-400">Used to deliver personalized ads</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={cookiePreferences.marketing}
                        onChange={() => handleCookieToggle('marketing')}
                        className="w-10 h-5 bg-gray-700 rounded-full appearance-none cursor-pointer transition duration-200 checked:bg-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="text-green-500 hover:text-green-400 text-sm underline mb-4 sm:mb-0"
              >
                {showDetails ? 'Hide cookie options' : 'Customize cookie preferences'}
              </button>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <button 
                  onClick={rejectNonEssential}
                  className="px-4 py-2 text-sm font-medium border border-gray-700 rounded-full hover:bg-gray-800 transition-colors text-gray-300"
                >
                  Essential Only
                </button>
                {showDetails && (
                  <button 
                    onClick={acceptSelected}
                    className="px-4 py-2 text-sm font-medium rounded-full text-white-1 bg-green-600 hover:bg-green-500 transition-colors shadow-md"
                  >
                    Accept Selected
                  </button>
                )}
                <button 
                  onClick={acceptAll}
                  className="px-6 py-2 text-sm font-medium rounded-full text-white-1 bg-green-600 hover:bg-green-500 transition-colors shadow-md"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-green-500 h-1 w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;