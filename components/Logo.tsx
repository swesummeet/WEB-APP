import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'dark' }) => {
  // Determine which image to show based on variant
  // variant='light' -> used on dark backgrounds -> needs light logo
  // variant='dark' -> used on light backgrounds -> needs dark logo
  const logoSrc = variant === 'light' ? '/logo-light.png' : '/logo-dark.png';

  return (
    <img
      src={logoSrc}
      alt="SUMMEET Logo"
      className={`h-12 w-auto object-contain ${className}`}
    />
  );
};