import React from "react";

function UploadContainer({ children }) {
  return (
    <div className="max-sm:h-[600px] relative bg-gray-900 text-white max-sm:p-4 md:px-6 md:py-20 rounded-lg shadow-lg max-sm:flex max-sm:flex-col max-sm:gap-10 md:flex md:flex-row md:items-center md:space-x-6">
      {children}
    </div>
  );
}

export default UploadContainer;
