import React from "react";

const ModernInput = ({
  label,
  value,
  setValue,
  icon,
  type = "text",
  placeholder = "",
  ...props
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <div className="relative flex items-center">
      {icon && (
        <span className="absolute left-4 inset-y-0 flex items-center text-indigo-500 text-xl">
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-${
          icon ? 12 : 4
        } pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400 shadow-sm`}
        {...props}
      />
    </div>
  </div>
);

export default ModernInput;
