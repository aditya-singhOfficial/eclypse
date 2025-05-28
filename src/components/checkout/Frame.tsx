import React from "react";

interface CheckoutButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
}

const buttonBase =
  "w-full max-w-xs sm:max-w-sm md:max-w-md flex items-center justify-center px-8 py-3 rounded-lg font-medium text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f63030] select-none";

export const CheckoutButton = ({
  text = "Buy",
  className = "",
  onClick,
}: CheckoutButtonProps) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type="button"
      className={`${buttonBase} ${
        hovered ? "bg-[#f63030] text-white" : "bg-black text-white"
      } ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
