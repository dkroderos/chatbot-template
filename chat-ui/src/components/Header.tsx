import { Moon, Sun, Trash } from "lucide-react";

interface Props {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onTrashClick: () => void;
}

const Header: React.FC<Props> = ({ isDarkMode, toggleTheme, onTrashClick }) => {
  return (
    <header className="fixed top-0 z-10 flex items-center justify-between px-2 py-2 bg-background text-black dark:text-white w-full">
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded bg-white dark:bg-black text-black dark:text-white flex items-center outline outline-2 outline-black/20 dark:outline-white/20 hover:outline-black dark:hover:outline-white focus:outline-black dark:focus:outline-white"
          title="Toggle theme (Ctrl + Shift + L)"
        >
          {isDarkMode ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          )}
        </button>

        <button
          onClick={onTrashClick}
          className="px-4 py-2 rounded bg-white dark:bg-black text-black dark:text-white flex items-center outline outline-2 outline-black/20 dark:outline-white/20 hover:outline-black dark:hover:outline-white focus:outline-black dark:focus:outline-white"
          title="Clear conversations (Ctrl + L)"
        >
          <Trash className="h-[1.2rem] w-[1.2rem]" />
        </button>
      </div>
    </header>
  );
};

export default Header;
