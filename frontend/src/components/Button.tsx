import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  size?: 'small' | 'medium' | 'large';
}

export function Button({
  text,
  type = 'button',
  size = 'medium',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`btn btn--${size} ${className}`.trim()}
      {...props}
    >
      {text}
    </button>
  );
}
