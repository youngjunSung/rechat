import React from 'react';

interface ButtonProps {
  className?: string;
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({ className, text, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center min-h-[54px] px-[10px] w-full bg-primary text-white rounded-[8px] text-[16px] font-bold ${className}`}
    >
      {text}
    </button>
  );
};
