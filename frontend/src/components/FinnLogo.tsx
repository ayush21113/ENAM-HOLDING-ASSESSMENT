import React from 'react';
import finnLogoImg from '../assets/finn_logo.png';

interface FinnLogoProps {
  className?: string;
  size?: number;
}

export const FinnLogo: React.FC<FinnLogoProps> = ({ className = '', size = 32 }) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-xs select-none ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <img
        src={finnLogoImg}
        alt="FINN Logo"
        className="w-full h-full object-cover rounded-xl"
        onError={(e) => {
          // Fallback to SVG if image fails to load
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};
