
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../translations';
import { RADIO_LOGO } from '../src/constants';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, onToggleTheme }) => {
  const [imgError, setImgError] = useState(false);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleState = (e: CustomEvent) => {
      if (e.detail && typeof e.detail.isPlaying === 'boolean') {
        setIsRadioPlaying(e.detail.isPlaying);
      }
    };
    window.addEventListener('wrf-radio-state' as any, handleState);
    return () => {
      window.removeEventListener('wrf-radio-state' as any, handleState);
    };
  }, []);

  const scrollToSection = (id: string) => {
    window.dispatchEvent(new CustomEvent('close-overlays'));
    
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 150; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const toggleRadioPlay = () => {
    window.dispatchEvent(new CustomEvent('wrf-toggle-play'));
  };

  const languages: { id: Language; label: string; flag: string }[] = [
    { id: 'pt', label: 'PT', flag: '🇵🇹' },
    { id: 'en', label: 'EN', flag: '🇬🇧' },
    { id: 'es', label: 'ES', flag: '🇪🇸' },
    { id: 'fr', label: 'FR', flag: '🇫🇷' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[200] transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-3">
        <div className="h-16 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#0b0e17]/80 dark:bg-[#07090e]/85 backdrop-blur-2xl border border-white/10 dark:border-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.35)] px-4 sm:px-6 flex items-center justify-between transition-colors">
          
          {/* Logo & Station Branding */}
          <div 
            className="flex items-center space-x-3 sm:space-x-4 cursor-pointer group select-none" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl border border-white/15 p-1 bg-black/70 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-red-500/50">
              {!imgError ? (
                <img 
                  src={RADIO_LOGO} 
                  alt="Web Rádio Figueiró" 
                  className="h-full w-full object-contain rounded-lg" 
                  onError={() => setImgError(true)} 
                />
              ) : (
                <span className="text-red-500 font-black text-xs tracking-tighter">WRF</span>
              )}
              {/* Subtle inner live dot */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 border-2 border-[#07090e]"></span>
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-[9px] sm:text-[10px] font-black text-red-500 uppercase tracking-[0.35em] leading-none">
                  Web Rádio
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                  HD 24H
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-brand font-black tracking-tighter text-white leading-none mt-0.5">
                FIGUEIRÓ<span className="text-red-500">.</span>
              </h1>
            </div>
          </div>

          {/* Center Navigation for Desktop */}
          <nav className="hidden lg:flex items-center space-x-1 sm:space-x-2 bg-white/[0.03] p-1.5 rounded-2xl border border-white/[0.06]">
            <button 
              onClick={() => {
                scrollToSection('multimedia');
                window.dispatchEvent(new CustomEvent('wrf-set-media-tab', { detail: { tab: 'playlist' } }));
              }} 
              className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:text-white hover:bg-red-600/20 transition-all flex items-center space-x-1.5"
            >
              <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span>{t.nav.playlist}</span>
            </button>
            <button 
              onClick={() => scrollToSection('programacao')} 
              className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              {t.nav.prog}
            </button>
            <button 
              onClick={() => scrollToSection('galeria')} 
              className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              {t.nav.gallery}
            </button>
            <button 
              onClick={() => scrollToSection('noticias')} 
              className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              {t.nav.news}
            </button>
          </nav>

          {/* Actions: Play Toggle, Languages, Theme, Contact */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Play/Stop Header Button */}
            <button
              onClick={toggleRadioPlay}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md ${
                isRadioPlaying
                  ? 'bg-red-600 text-white shadow-red-600/30 ring-2 ring-red-500/50'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
              title={isRadioPlaying ? "Pausar emissão" : "Ouvir em direto"}
            >
              {isRadioPlaying ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  <span className="text-[10px] sm:text-xs">No Ar</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-red-500 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span className="text-[10px] sm:text-xs">Ouvir</span>
                </>
              )}
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-white/[0.04] p-1 rounded-xl sm:rounded-2xl border border-white/[0.08]">
              {languages.map((lang) => (
                <button 
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                    language === lang.id 
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={lang.label}
                >
                  <span className="text-xs sm:text-sm">{lang.flag}</span>
                  <span className="hidden sm:inline text-[10px] uppercase font-mono">{lang.id}</span>
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={onToggleTheme} 
              className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white border border-white/[0.08] transition-all"
              title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
            >
              {isDark ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Contact Button */}
            <a 
              href="https://wa.me/351910270085" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-5 py-2.5 rounded-xl sm:rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/25 transition-all hover:scale-105 active:scale-95"
            >
              <span>{t.nav.contactBtn}</span>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;

