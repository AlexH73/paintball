import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = "", onClick }) => {
  const baseClasses = "bg-white rounded-lg shadow-md overflow-hidden";

  return (
    <div className={`${baseClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
