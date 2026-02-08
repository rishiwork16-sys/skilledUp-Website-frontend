import React, { useState, useRef, useEffect } from "react";

const CustomSelect = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select option",
  error
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* INPUT (Same as inputClass look) */}
      <div
  onClick={() => setOpen(!open)}
  className={`mt-1 w-full h-[34px] rounded-xl border border-gray-300 px-4 text-sm
  cursor-pointer bg-white flex items-center justify-between
  focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent
  transition-all
  ${error ? "border-red-500" : ""}`}
>

        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <span className="text-gray-500">▾</span>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {options.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer"
            >
              {opt}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default CustomSelect;
