interface ActionButtonProps {
  onClick: () => void;
  variant: "help" | "logout";
  children: React.ReactNode;
}

export function ActionButton({
  onClick,
  variant,
  children,
}: ActionButtonProps) {
  const baseClasses =
    "px-3 py-2 text-white border-none rounded-md cursor-pointer text-sm transition-colors duration-300";
  const variantClasses =
    variant === "help"
      ? "bg-purple-600 hover:bg-purple-500"
      : "bg-gray-600 hover:bg-gray-500";

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {children}
    </button>
  );
}
