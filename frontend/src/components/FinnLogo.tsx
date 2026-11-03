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
      title="PULSE · ENAM Intelligence"
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rounded Icon Background in Groww / ENAM Emerald */}
        <rect width="100" height="100" rx="24" fill="#00D09C" />
        
        {/* Inner Highlight Border */}
        <rect x="2" y="2" width="96" height="96" rx="22" stroke="white" strokeOpacity="0.3" strokeWidth="2.5" />
        
        {/* Modern Monogram P for PULSE */}
        <path 
          d="M26 76 L26 24 L52 24 C64 24 72 31 72 43 C72 55 64 62 52 62 L38 62 L38 76 Z M38 50 L50 50 C57 50 60 47 60 43 C60 39 57 36 50 36 L38 36 Z" 
          fill="white" 
        />
        
        {/* Real-time Pulse Heartbeat dot */}
        <circle cx="74" cy="24" r="5" fill="#005A3C" />
      </svg>
    </div>
  );
};
