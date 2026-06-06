import { type ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (

    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900 text-slate-100">
      
      
      <header className="flex items-center justify-between px-6 py-4 h-16 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-400 rounded" />
          <span className="font-bold text-lg tracking-wider">BEGO LOGISTICS</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">Control Panel</span>
          <div className="w-8 h-8 rounded-full bg-slate-700" /> {/* Avatar */}
        </div>
      </header>

      {/* Cuerpo principal donde se inyectan las vistas */}
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
      
    </div>
  );
}