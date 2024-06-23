import React from "react";

const CustomButton = ({ onClick, className, type, children }) => {
  return (
    <button
      type={type ? type : "button"}
      className={`btn btn-green ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default CustomButton;
