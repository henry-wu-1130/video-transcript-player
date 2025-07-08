import type { ReactNode } from 'react';

interface LayoutProps {
  header: ReactNode;
  children: ReactNode;
}

export function Layout({ header, children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-secondary-50 overflow-hidden">
      <header className="h-[60px] shadow-lg bg-secondary-100/50 backdrop-blur-sm sticky top-0 z-10">
        {header}
      </header>
      <main className="flex-1 flex flex-col lg:flex-row p-0 overflow-hidden">{children}</main>
    </div>
  );
}
