import React from "react";

const InputBox = ({ label, placeholder, onChange, inputType = "text" }) => {
  return (
    <div>
      <p className="text-left font-medium text-sm py-2">{label}</p>
      <input
        type={inputType}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full border px-2 py-1 rounded border-slate-200"
      />
    </div>
  );
};

export default InputBox;
