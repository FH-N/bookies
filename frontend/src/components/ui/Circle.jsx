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
      className={`rounded-full flex items-center justify-center ${className} ${
        checked ? "bg-lemon-lime" : "bg-electric-indigo text-white"
      }`}
      style={{
        width: size,
        height: size,
      }}
      onClick={toggleCheck} // Toggle on click
    >
      {checked ? (
        <IconCheck className="text-electric-indigo" size="50px" />
      ) : (
        <IconX className="text-lemon-lime" size="50px" />
      )}
    </div>
  );
};

export default Circle;
