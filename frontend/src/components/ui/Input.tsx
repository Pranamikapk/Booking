import React from 'react';


interface InputProps{
  type?: string;
  placeholder?: string
  value : string
  onChange : (event: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
    min?: string
}

const Input : React.FC<InputProps> = ({
   type = 'text', 
   placeholder, 
   value, 
   onChange, 
   className ,
   min
  }) => {
  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem',
    fontSize: '1rem',
    lineHeight: '1.5',
    color: '#374151',
    backgroundColor: '#ffffff',
    backgroundClip: 'padding-box',
    border: '1px solid #d1d5db',
    borderRadius: '0.25rem',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      style={inputStyle}
      min={min}
    />
  );
}

export default Input