import React from 'react';

interface FinnLogoProps {
  className?: string;
  size?: number;
}

export const FinnLogo: React.FC<FinnLogoProps> = ({ 
  className = '', 
  size = 34,
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-xs select-none ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      title="FINN Financial Investment Agent"
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rounded Icon Background in Groww Green */}
        <rect width="100" height="100" rx="24" fill="#00D09C" />
        
        {/* Inner Highlight Border */}
        <rect x="2" y="2" width="96" height="96" rx="22" stroke="white" strokeOpacity="0.3" strokeWidth="2.5" />
        
        {/* Main Monogram F Spine & Arms in Crisp White */}
        <path 
          d="M24 25 C24 22.8 25.8 21 28 21 L64 21 C66.2 21 68 22.8 68 25 C68 27.2 66.2 29 64 29 L35 29 L35 43 L56 43 C58.2 43 60 44.8 60 47 C60 49.2 58.2 51 56 51 L35 51 L35 75 C35 77.2 33.2 79 31 79 C28.8 79 27 77.2 27 75 L27 25 Z" 
          fill="white" 
        />
        
        {/* Financial Compounding Ascending Bars */}
        <rect x="42" y="58" width="8" height="18" rx="4" fill="#005A3C" />
        <rect x="54" y="47" width="8" height="29" rx="4" fill="#E8F8F3" />
        <rect x="66" y="36" width="8" height="40" rx="4" fill="white" />
        
        {/* Compounding Growth Arrow */}
        <path d="M70 19 L78 28 L62 28 Z" fill="white" />
      </svg>
    </div>
  );
};
