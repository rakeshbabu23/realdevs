import React from "react";

const FormContainer = ({ children, styles }) => {
  return (
    <div
      className={`w-full max-w-md p-8  bg-white text-white rounded-xl shadow-lg ${styles}`}
    >
      {children}
    </div>
  );
};

export default FormContainer;
