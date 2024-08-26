import React, { memo } from 'react';

interface TextFieldProps {
  id?: string;
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number | readonly string[] | undefined;
}

export const TextField: React.FC<TextFieldProps> = memo(({ id, label, type = 'text', className, onChange, value }) => {
  // console.log(`${label} 렌더링!`);
  return (
    <div className={`flex flex-col [&:not(&:last-child)]:mb-[20px] ${className}`}>
      <label htmlFor={id} className="mb-[4px] text-primary text-[14px] font-[500]">
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="py-[10px] border-b-[2px] border-primary border-solid rounded-none focus:outline-none"
        onChange={onChange}
        value={value}
      />
    </div>
  );
});
