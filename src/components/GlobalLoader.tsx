'use client'
import React, { useState, useEffect } from 'react';

const SpotifyLoader = () => {
  // State to manage the random heights of sound waves
  const [heights, setHeights] = useState([3, 5, 7, 4, 6]);
  
  // Effect to randomize heights periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newHeights = heights.map(() => Math.floor(Math.random() * 10) + 2);
      setHeights(newHeights);
    }, 600);
    
    return () => clearInterval(interval);
  }, [heights]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative">
        {/* Main spinner */}
        <div className="relative w-32 h-32">
          {/* Outer ring */}
          <div
            className="absolute w-full h-full rounded-full border-[3px] border-gray-800/40 border-r-green-500 border-b-green-500 animate-spin"
            style={{ animationDuration: '3s' }}
          ></div>
          
          {/* Inner ring */}
          <div
            className="absolute w-full h-full rounded-full border-[3px] border-gray-800/40 border-t-green-400 animate-spin"
            style={{ animationDuration: '2s', animationDirection: 'reverse' }}
          ></div>
          
          {/* Middle ring */}
          <div
            className="absolute w-3/4 h-3/4 top-1/8 left-1/8 rounded-full border-[2px] border-gray-800/30 border-l-green-300 border-t-green-300 animate-spin"
            style={{ top: '12.5%', left: '12.5%', animationDuration: '1.5s' }}
          ></div>
          
          {/* Center circle */}
          <div className="absolute w-1/2 h-1/2 top-1/4 left-1/4 rounded-full bg-green-500/20"></div>
          
          {/* Sound waves inside the circle */}
          <div className="absolute w-full h-full flex items-center justify-center">
            <div className="flex items-end space-x-1">
              {heights.map((height, index) => (
                <div 
                  key={index}
                  className="w-1 bg-green-500 rounded-full transition-all duration-300"
                  style={{ 
                    height: `${height}px`,
                    animationDelay: `${index * 0.1}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Background glow */}
        <div
          className="absolute inset-0 bg-gradient-to-tr from-green-500/10 via-transparent to-green-500/5 animate-pulse rounded-full blur-md"
        ></div>
        
        {/* Tech-inspired details */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 text-center">
          <div className="text-green-500 text-xs font-mono">LOADING</div>
          <div className="flex justify-center gap-1 mt-1">
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyLoader;