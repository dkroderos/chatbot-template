import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const ThemeToggleButton: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded bg-white dark:bg-black text-black dark:text-white flex items-center outline outline-2 outline-black/20 dark:outline-white/20 hover:outline-black dark:hover:outline-white focus:outline-black dark:focus:outline-white"
    >
      {isDarkMode ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
