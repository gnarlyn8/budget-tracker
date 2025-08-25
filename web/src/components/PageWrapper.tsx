interface PageWrapperProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "5xl" | "6xl";
}

export function PageWrapper({ children, maxWidth = "6xl" }: PageWrapperProps) {
  const maxWidthClass = `max-w-${maxWidth}`;

  return (
    <div className="w-full min-h-screen font-sans bg-gray-900">
      <div className={`${maxWidthClass} mx-auto p-8`}>{children}</div>
    </div>
  );
}
