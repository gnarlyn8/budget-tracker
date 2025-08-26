interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="w-full min-h-screen font-sans bg-gray-900">
      <div className="max-w-4xl mx-auto p-8">{children}</div>
    </div>
  );
}
