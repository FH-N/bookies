import { useState } from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";

function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-light-purple dark:bg-deep-purple text-white"
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? (
        <IconSun
          size={20}
          className="transition-transform transform rotate-0"
        />
      ) : (
        <IconMoon
          size={20}
          className="transition-transform transform rotate-0"
        />
      )}
    </button>
  );
}

export default DarkModeToggle;
