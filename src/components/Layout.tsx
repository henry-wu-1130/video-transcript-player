import type { ReactNode } from 'react';

interface LayoutProps {
  header: ReactNode;
  children: ReactNode;
}

export function Layout({ header, children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <header className="h-[60px] shadow-lg bg-secondary-100/50 backdrop-blur-sm">{header}</header>
      <main className="flex-1 flex p-0">{children}</main>
    </div>
  );
}
