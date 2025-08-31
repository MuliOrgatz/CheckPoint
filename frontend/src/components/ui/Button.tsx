import * as React from 'react';

type ButtonProps = {
  className?: string;
  variant?:
    | 'turquoise'
    | 'blue'
    | 'deepBlue'
    | 'white'
    | 'link'
    | 'ghost'
    | 'inline'
    | 'pink';
  size?: 'default' | 'popup' | 'icon' | 'fit' | 'wide';
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  className = '',
  variant = 'pink',
  size = 'default',
  onClick,
  children,
  type = 'button',
  disabled = false,
}) => {
  const baseStyles =
    'inline-flex items-center justify-center whitespace-nowrap rounded-lg transition-colors hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 text-sm disabled:hover:cursor-default';

  const variantStyles = {
    blue: `bg-blue text-white ${disabled ? '' : 'hover:bg-darkBlue'}`,
    turquoise: `bg-turquoise text-white ${
      disabled ? '' : 'hover:bg-darkTurquoise'
    }`,
    deepBlue: `bg-deepBlue text-white hover:bg-darkBlue`,
    white: `bg-white text-darkTurquoise border border-darkTurquoise ${
      disabled ? '' : 'hover:text-turquoise hover:border-turquoise'
    }`,
    link: 'text-pink underline p-0 h-auto w-auto hover:text-darkPink',
    ghost: 'text-turquoise-700 ',
    inline: '',
    pink: `bg-pink text-white ${disabled ? '' : 'hover:bg-darkPink'}`,
  };

  const sizeStyles = {
    default: 'h-[33px] w-[145px] px-[8px] py-[6px]',
    popup: 'h-[33px] w-[112px] px-[8px] py-[6px]',
    icon: 'h-10 w-10',
    fit: 'w-fit ',
    wide: 'h-[33px] px-[8px] py-[6px]',
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button
      className={combinedStyles}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export { Button };
