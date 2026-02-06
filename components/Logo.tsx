import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'dark' }) => {
  // Brand Colors
  const darkBlue = '#325D79';
  const orange = '#F9A26C'; // Using the lighter orange for the dots to pop, or F26627
  const white = '#FFFFFF';

  const textColor = variant === 'light' ? white : darkBlue;

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Dots Container - Positioned absolutely relative to the text for precision */}
      <div className="flex gap-4 mb-1">
        <div className="w-3 h-3 rounded-full bg-[#F9A26C]"></div>
        <div className="w-3 h-3 rounded-full bg-[#F9A26C]"></div>
        <div className="w-3 h-3 rounded-full bg-[#F9A26C]"></div>
      </div>
      
      {/* Text */}
      <div 
        className="text-4xl font-light tracking-[0.1em]" 
        style={{ color: textColor, fontFamily: 'Inter, sans-serif' }}
      >
        SUMMEET
      </div>
    </div>
  );
};