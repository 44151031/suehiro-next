"use client";

import { InputHTMLAttributes, forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const FormInput = forwardRef<HTMLInputElement, Props>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full border border-gray-400 bg-white rounded px-3 py-2 
            focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${className}`}
          {...props}
        />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
export default FormInput;
