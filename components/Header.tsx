
import React, { useState } from 'react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, onToggleTheme }) => {
  const [imgError, setImgError] = useState(false);
  const logoPath = "./logo.png";

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMailTo = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = "mailto:webradiofigueiro@gmail.pt";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-all duration-500">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGOTIPO PROFISSIONAL COMPOSITIVO */}
        <div 
          className="flex items-center space-x-4 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600/20 rounded-2xl blur-xl group-hover:bg-blue-600/40 transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
            <div className="relative h-12 w-12 rounded-2xl border border-gray-200 dark:border-white/10 p-1 bg-white dark:bg-gray-900 flex items-center justify-center shadow-lg transition-all group-hover:scale-105 group-hover:-rotate-3">
              {!imgError ? (
                <img 
                  src={logoPath} 
                  alt="WRF" 
                  className="h-full w-full object-contain rounded-xl"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="bg-blue-600 w-full h-full flex items-center justify-center rounded-xl">
                  <span className="text-white font-black text-lg">F</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] font-medium text-slate-400 dark:text-gray-500 uppercase tracking-[0.3em] leading-none mb-1">
              Web Rádio
            </span>
            <h1 className="text-xl md:text-2xl font-brand font-black tracking-tighter text-slate-900 dark:text-white leading-none">
              FIGUEIRÓ<span className="text-blue-600 dark:text-blue-500">.</span>
            </h1>
          </div>
        </div>

        {/* NAVEGAÇÃO E AÇÕES */}
        <div className="flex items-center space-x-6">
          <nav className="hidden lg:flex items-center space-x-8">
            <button onClick={() => scrollToSection('programacao')} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-all">
              Programação
            </button>
            <button onClick={() => scrollToSection('galeria')} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-all">
              Galeria
            </button>
            <button onClick={() => scrollToSection('parcerias')} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-all">
              Parcerias
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-blue-400 border border-transparent hover:border-blue-500/30 transition-all"
              aria-label="Alternar tema"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>

            <button 
              onClick={handleMailTo}
              className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              Contactar
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
