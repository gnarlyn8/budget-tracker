interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export function Header({ children, className = "" }: HeaderProps) {
  return (
    <header
      className={`text-center mb-8 bg-gray-800 p-6 rounded-xl shadow-md ${className}`}
    >
      <img src="/casapay-logo.png" alt="CasaPay" className="h-24 w-auto m-0" />
      {children}
    </header>
  );
}
