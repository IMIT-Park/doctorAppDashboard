import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const CustomSwitch = ({
  checked,
  onChange,
  tooltipText,
  uniqueId,
  size = "normal",
}) => {
  const isLarge = size === "large";

  return (
    <Tippy content={tooltipText}>
      <label
        className={`relative ${isLarge ? "w-12 h-6" : "w-[46px] h-[22px]"}`}
        onClick={(e) => {
          e.stopPropagation();
          onChange(e);
        }}
      >
        <input
          type="checkbox"
          className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
          id={`custom_switch_checkbox_${uniqueId}`}
          checked={checked}
          readOnly
        />
        <span
          className={`block h-full rounded-full bg-[#ebedf2] dark:bg-dark before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 ${
            isLarge
              ? "before:w-4 before:h-4 peer-checked:before:left-7"
              : "before:w-[14px] before:h-[14px] peer-checked:before:left-7"
          } before:rounded-full peer-checked:bg-[#006241] before:transition-all before:duration-300`}
        ></span>
      </label>
    </Tippy>
  );
};

export default CustomSwitch;
