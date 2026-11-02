import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  size?: 'small' | 'medium' | 'large';
}

export function Button({ text, size = 'medium', className = '', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn--${size} ${className}`.trim()}
      {...props}
    >
      {text}
    </button>
  );
}
