"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function F1ScrollTracker() {
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      
      const maxScroll = docHeight - winHeight;
      if (maxScroll <= 0) {
        setCompletionPercentage(0);
        return;
      }
      
      const percentage = (scrollY / maxScroll) * 100;
      setCompletionPercentage(percentage);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initialize position on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 z-[9999] pointer-events-none overflow-visible">


      {/* Checkered Flag Progress Trail */}
      <div 
        className="absolute left-0 top-1.5 bottom-1.5"
        style={{
          width: `${completionPercentage}%`,
          backgroundImage: 'conic-gradient(rgba(255,255,255,0.15) 90deg, rgba(0,0,0,0.8) 90deg 180deg, rgba(255,255,255,0.15) 180deg 270deg, rgba(0,0,0,0.8) 270deg)',
          backgroundSize: '16px 16px',
          transition: 'width 0.1s linear'
        }}
      >
        {/* Glowing Red Leading Line */}
        <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#ff0000] shadow-[0_0_12px_4px_#ff0000]"></div>
      </div>
      

      {/* Car Indicator */}
      <div 
        className="absolute w-32 h-14"
        style={{ 
          top: '50%',
          marginTop: '-28px', // Center vertically based on h-14 (56px)
          transform: `translateX(calc(${completionPercentage}vw - ${completionPercentage}%))`,
          transition: 'transform 0.1s linear'
        }}
      >
        {/* Percentage on the left of the car */}
        <div className="absolute top-1/2 -translate-y-1/2 right-full mr-3 text-white font-mono font-bold text-[10px] bg-black/80 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(255,0,0,0.6)] border border-[#ff0000] backdrop-blur-sm whitespace-nowrap">
          {Math.round(completionPercentage)}%
        </div>

        <Image 
          src="/car.png" 
          alt="F1 Car Scroll Indicator" 
          fill
          className="object-contain drop-shadow-[4px_4px_4px_rgba(0,0,0,0.8)]"
          priority
        />
      </div>
    </div>
  );
}
