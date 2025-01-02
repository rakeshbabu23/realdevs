import React from "react";
const Box = ({ children }) => {
  return (
    <div className="w-[100%] flex items-center justify-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      {children}
    </div>
  );
};

export default Box;
