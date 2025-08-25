interface NavigationButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function NavigationButton({
  isActive,
  onClick,
  children,
}: NavigationButtonProps) {
  return (
    <button
      className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border-2 border-purple-500 bg-transparent text-purple-500 rounded-lg cursor-pointer text-sm sm:text-base transition-all duration-300 hover:bg-purple-500 hover:text-white ${
        isActive ? "bg-purple-500 text-white" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
