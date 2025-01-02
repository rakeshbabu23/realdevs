import React from "react";

const FormField = ({ label, name, type, formik, className = "" }) => {
  return (
    <div className={`${className} relative`}>
      <input
        type={type}
        id={name}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-full bg-transparent border-b-2 border-purple-400 text-purple-100 focus:outline-none focus:border-purple-300 transition-colors py-2 peer placeholder-transparent"
        placeholder={label}
      />
      <label
        htmlFor={name}
        className="absolute left-0 -top-3.5 text-pink-200 placeholder-pink-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-purple-300 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-300 peer-focus:text-sm"
      >
        {label}
      </label>
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-400 text-xs mt-1">{formik.errors[name]}</div>
      )}
    </div>
  );
};

export default FormField;
