import React from "react";

function Card({ children, url }) {
  const handleClick = (e) => {
    // e.preventDefault(); // Prevent default action
    // window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <div
      onClick={handleClick}
      className="cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      {children}
    </div>
  );
}

export default Card;
