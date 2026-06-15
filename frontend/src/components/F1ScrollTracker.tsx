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
    <div className="fixed bottom-0 left-0 w-full h-12 z-[9999] bg-slate-950/80 backdrop-blur pointer-events-none">
      <div className="absolute inset-y-0 w-full border-b border-slate-800" style={{ top: '50%' }}></div>
      <div 
        className="absolute w-24 h-10"
        style={{ 
          top: '50%',
          marginTop: '-20px', // center vertically based on height
          // Translate by percentage of viewport width, subtract its own width percentage to keep it on screen
          transform: `translateX(calc(${completionPercentage}vw - ${completionPercentage}%))`,
          transition: 'transform 0.1s linear'
        }}
      >
        <Image 
          src="/car.png" 
          alt="F1 Car Scroll Indicator" 
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
