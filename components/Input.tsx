import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={inputId} className="text-sm font-medium text-[#325D79]">
        {label}
      </label>
      <input
        id={inputId}
        className={`px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9A26C] focus:border-[#F26627] transition-colors
          ${error ? 'border-red-500 focus:ring-red-200' : 'border-[#9BD7D1] text-[#325D79]'}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};