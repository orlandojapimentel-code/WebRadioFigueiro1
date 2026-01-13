
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
          <div className="h-12 w-12 rounded-full border-2 border-blue-500 p-0.5 overflow-hidden bg-gray-800 flex items-center justify-center">
            {!imgError ? (
              <img 
                src={logoPath} 
                alt="Logo Web Rádio Figueiró" 
                className="h-full w-full object-cover rounded-full"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="text-blue-500 font-black text-[10px] leading-none">WRF</span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Web Rádio Figueiró</h1>
            <p className="text-xs text-blue-400 font-medium uppercase tracking-widest">A Sua Melhor Companhia</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('programacao')} 
            className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors"
          >
            Programação
          </button>
          <button 
            onClick={() => scrollToSection('galeria')} 
            className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors"
          >
            Galeria
          </button>
          <button 
            onClick={() => scrollToSection('parcerias')} 
            className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors"
          >
            Parcerias
          </button>
          <button 
            onClick={handleMailTo}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105"
          >
            Seja Parceiro
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
