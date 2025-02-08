import React from 'react';

type ButtonProps = {
  variant?: 'primary' | 'secondary';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ variant = 'primary', ...props }: ButtonProps) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-lg ${
      variant === 'primary' 
        ? 'bg-blue-600 text-white hover:bg-blue-700' 
        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    } ${props.className || ''}`}
  />
);