import ThemeToggleButton from "../components/ThemeToggleButton";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 z-50 flex items-center justify-between px-2 sm:px-4 py-2 bg-background text-black dark:text-white w-full">
      <div className="flex items-center space-x-1 sm:space-x-2">
        <ThemeToggleButton />
      </div>
    </header>
  );
};

export default Header;
