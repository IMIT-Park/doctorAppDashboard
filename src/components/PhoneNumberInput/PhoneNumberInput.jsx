import React from "react";

const PhoneNumberInput = ({ value, onChange, error, maxLength,disabled }) => {
  const handlePhoneChange = (e) => {
    const { value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    onChange(numericValue.slice(0, maxLength));
  };
  return (
    <div className={`${error && "has-error"}`}>
      <div className="flex">
        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-medium text-sm border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
          +91
        </div>
        <input
          type="tel"
          id="phone"
          placeholder="Phone Number"
          className="form-input form-input-green rounded-l-none"
          value={value}
          onChange={handlePhoneChange}
          maxLength={maxLength}
          disabled={disabled}
        />
      </div>
      {error && (
        <div className="text-danger text-sm mt-1">{error}</div>
      )}
    </div>
  );
};

export default PhoneNumberInput;
