
import React, { useState } from 'react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, onToggleTheme }) => {
  const [imgError, setImgError] = useState(false);
  // Caminho relativo explícito para o ficheiro na raiz
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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 transition-colors duration-500">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LADO ESQUERDO: LOGO E NOME */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-blue-500 p-0.5 overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20 flex-shrink-0 transition-transform hover:scale-105">
            {!imgError ? (
              <img 
                src={logoPath} 
                alt="Logo Web Rádio Figueiró" 
                className="h-full w-full object-contain rounded-full"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 w-full h-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                </svg>
              </div>
            )}
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none transition-colors">Web Rádio Figueiró</h1>
            <p className="text-[9px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest mt-1">A Sua Melhor Companhia</p>
          </div>
        </div>

        {/* LADO DIREITO: AÇÕES E NAV */}
        <div className="flex items-center space-x-2 md:space-x-4">
          
          {/* NAV LINKS: APENAS DESKTOP */}
          <nav className="hidden lg:flex items-center space-x-6 lg:space-x-8 mr-4">
            <button onClick={() => scrollToSection('programacao')} className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors">
              Programação
            </button>
            <button onClick={() => scrollToSection('galeria')} className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors">
              Galeria
            </button>
            <button onClick={() => scrollToSection('parcerias')} className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors">
              Parcerias
            </button>
          </nav>

          <div className="hidden md:block h-6 w-[1px] bg-gray-200 dark:bg-white/10 mx-2"></div>

          {/* BOTÃO SWITCH TEMA: SEMPRE VISÍVEL */}
          <button 
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-slate-600 dark:text-blue-400 border border-gray-200 dark:border-white/10 hover:border-blue-500/30 transition-all active:scale-95 shadow-sm"
            title={isDark ? "Mudar para Modo Dia" : "Mudar para Modo Noite"}
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* BOTÃO PARCEIRO: APENAS DESKTOP */}
          <button 
            onClick={handleMailTo}
            className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95 items-center space-x-2"
          >
            <span>Seja Parceiro</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
