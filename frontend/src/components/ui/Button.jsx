const Button = ({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`font-poppins px-4 py-2 font-medium rounded-full focus:outline-none focus:ring transition duration-150 ${
        disabled
          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
          : "bg-aqua-teal text-white hover:bg-lemon-lime hover:text-black"
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
