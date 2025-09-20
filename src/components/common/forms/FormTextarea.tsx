"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

const FormTextarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, className = "", ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full border border-gray-400 bg-white rounded px-3 py-2 
            focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${className}`}
          {...props}
        />
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
export default FormTextarea;
