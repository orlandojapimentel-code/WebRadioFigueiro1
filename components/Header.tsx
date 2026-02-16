
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../translations';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, onToggleTheme }) => {
  const [imgError, setImgError] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const logoPath = "./logo.png";

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 160; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const languages: { id: Language; label: string; flag: string }[] = [
    { id: 'pt', label: 'PT', flag: '🇵🇹' },
    { id: 'en', label: 'EN', flag: '🇬🇧' },
    { id: 'es', label: 'ES', flag: '🇪🇸' },
    { id: 'fr', label: 'FR', flag: '🇫🇷' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 transition-all duration-500">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative h-12 w-12 rounded-xl border border-white/10 p-1 bg-[#0f172a] flex items-center justify-center shadow-2xl transition-all group-hover:scale-110">
            {!imgError ? (
              <img src={logoPath} alt="WRF" className="h-full w-full object-contain rounded-lg" onError={() => setImgError(true)} />
            ) : (
              <span className="text-red-600 font-black text-xs">WRF</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] leading-none mb-1">Web Rádio</span>
            <h1 className="text-xl md:text-2xl font-brand font-black tracking-tighter text-white leading-none">FIGUEIRÓ<span className="text-red-600">.</span></h1>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <nav className="hidden xl:flex items-center space-x-7">
            <button onClick={() => scrollToSection('programacao')} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-red-500 transition-colors">{t.nav.prog}</button>
            <button onClick={() => scrollToSection('multimedia')} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-blue-500 transition-colors">{t.nav.media}</button>
            <button onClick={() => scrollToSection('galeria')} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-amber-500 transition-colors">{t.nav.gallery}</button>
            <button onClick={() => scrollToSection('noticias')} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-emerald-500 transition-colors">{t.nav.news}</button>
          </nav>

          <div className="h-8 w-[1px] bg-white/10 hidden xl:block"></div>

          <div className="flex items-center bg-white/5 p-1 rounded-xl space-x-1 border border-white/5">
            {languages.map((lang) => (
              <button 
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`p-1.5 rounded-lg text-sm transition-all flex items-center justify-center aspect-square ${language === lang.id ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-red-500 hover:bg-white/5'}`}
                title={lang.label}
              >
                {lang.flag}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={onToggleTheme} className="p-2.5 rounded-xl bg-white/5 text-red-400 border border-transparent hover:border-red-500/30">
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            <button className="hidden sm:flex bg-red-600 text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-600/30 hover:bg-red-500 hover:scale-105 active:scale-95 transition-all">
              {t.nav.contactBtn}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
