import React from "react";

function ImageContainer({ children }) {
  return (
    <div className="md:w-1/2 max-sm:w-full max-sm:mt-8">
      <div className="bg-gray-800 rounded-lg md:p-4 flex items-center justify-center h-full ">
        {children}
      </div>
    </div>
  );
}

export default ImageContainer;
