
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [imgError, setImgError] = useState(false);
  const logoPath = "logo.png";

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
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="h-12 w-12 rounded-full border-2 border-blue-500 p-0.5 overflow-hidden bg-gray-800 flex items-center justify-center shadow-lg shadow-blue-500/20">
            {!imgError ? (
              <img 
                src={logoPath} 
                alt="Logo Web Rádio Figueiró" 
                className="h-full w-full object-cover rounded-full"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 w-full h-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"/>
                </svg>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">Web Rádio Figueiró</h1>
            <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-1">A Sua Melhor Companhia</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('programacao')} 
            className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            Programação
          </button>
          <button 
            onClick={() => scrollToSection('galeria')} 
            className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            Galeria
          </button>
          <button 
            onClick={() => scrollToSection('parcerias')} 
            className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            Parcerias
          </button>
          <button 
            onClick={handleMailTo}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            Seja Parceiro
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
