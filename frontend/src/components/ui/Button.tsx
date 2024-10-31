import React, { MouseEventHandler, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'verified' | 'list'; 
}

const Button: React.FC<ButtonProps> = ({
  children, 
  onClick, 
  className, 
  type = 'button', 
  disabled = false,
  variant = 'primary'  
}) => {

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: '#1C386E', color: '#ffffff' },
    secondary: { backgroundColor: '#6c757d', color: '#ffffff' },
    danger: { backgroundColor: '#dc3545', color: '#ffffff' },
    verified: { backgroundColor: '#ffc107', color: '#000000' }, 
    list: { backgroundColor: '#28a745', color: '#000000' },
  };

  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ...variantStyles[variant], 
  };

  const disabledStyle: React.CSSProperties = {
    opacity: 0.5,
    cursor: 'not-allowed',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      style={disabled ? { ...buttonStyle, ...disabledStyle } : buttonStyle}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
