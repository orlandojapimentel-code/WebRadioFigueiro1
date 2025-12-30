
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [imgError, setImgError] = useState(false);
  const logoUrl = "/logo.png?v=10";

  return (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full border-2 border-blue-500 p-0.5 overflow-hidden bg-gray-800 flex items-center justify-center">
            {!imgError ? (
              <img 
                src={logoUrl} 
                alt="Logo Web Rádio Figueiró" 
                className="h-full w-full object-cover rounded-full"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-blue-500 font-bold text-xs text-center leading-none">WRF</span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Web Rádio Figueiró</h1>
            <p className="text-xs text-blue-400 font-medium uppercase tracking-widest">A Sua Melhor Companhia</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#programacao" className="text-sm font-medium hover:text-blue-400 transition-colors">Programação</a>
          <a href="#parcerias" className="text-sm font-medium hover:text-blue-400 transition-colors">Parcerias</a>
          <a href="mailto:webradiofigueiro@gmail.pt" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105">
            Seja Parceiro
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;