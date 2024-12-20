import { useState } from "react";
import { IconX, IconCheck } from "@tabler/icons-react";

const Circle = ({ size = "60px", className = "" }) => {
  // State to manage checked/unchecked status
  const [checked, setChecked] = useState(false);

  // Toggle the checked state on click
  const toggleCheck = () => {
    setChecked(!checked);
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center cursor-pointer ${className} ${
        checked
          ? "dark:bg-lemon-lime bg-pink-flower"
          : "dark:bg-electric-indigo bg-lemon-lime text-white"
      }`}
      style={{
        width: size,
        height: size,
      }}
      onClick={toggleCheck} // Toggle on click
    >
      {checked ? (
        <IconCheck
          className="dark:text-electric-indigo text-lemon-lime"
          size="40px"
        />
      ) : (
        <IconX className="dark:text-lemon-lime text-pink-flower" size="40px" />
      )}
    </div>
  );
};

export default Circle;
