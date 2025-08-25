interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onHelpClick: () => void;
  onLogoutClick: () => void;
}

export function MobileMenu({
  isOpen,
  onToggle,
  onHelpClick,
  onLogoutClick,
}: MobileMenuProps) {
  return (
    <div className="sm:hidden relative">
      <button onClick={onToggle} className="p-2 text-gray-300 hover:text-white">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-gray-700 rounded-lg shadow-lg border border-gray-600 min-w-[120px] z-10">
          <button
            onClick={() => {
              onHelpClick();
              onToggle();
            }}
            className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-200 !bg-gray-700 border border-gray-800 rounded-t-lg"
          >
            Help
          </button>
          <button
            onClick={() => {
              onLogoutClick();
              onToggle();
            }}
            className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-200 !bg-gray-700 border border-gray-800 rounded-b-lg"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
