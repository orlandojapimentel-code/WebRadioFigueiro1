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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleState = (e: Event) => {
      const customEvent = e as CustomEvent<{ isPlaying?: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.isPlaying === 'boolean') {
        setIsRadioPlaying(customEvent.detail.isPlaying);
      }
    };
    window.addEventListener('wrf-radio-state', handleState);
    return () => {
      window.removeEventListener('wrf-radio-state', handleState);
    };
  }, []);

  const scrollToSection = (id: string, tab?: string) => {
    setMobileMenuOpen(false);
    window.dispatchEvent(new CustomEvent('close-overlays'));
    if (tab) {
      window.dispatchEvent(new CustomEvent('wrf-set-media-tab', { detail: { tab } }));
    }
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 112;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const toggleRadioPlay = () => {
    window.dispatchEvent(new CustomEvent('wrf-toggle-play'));
  };

  const languages: { id: Language; label: string }[] = [
    { id: 'pt', label: 'PT' },
    { id: 'en', label: 'EN' },
    { id: 'es', label: 'ES' },
    { id: 'fr', label: 'FR' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[200] bg-white/92 dark:bg-[#07090e]/92 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.08] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg"
        >
          <span className="h-9 w-9 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-950 p-1 flex items-center justify-center shrink-0 overflow-hidden">
            {!imgError ? (
              <img
                src={RADIO_LOGO}
                alt="Web Rádio Figueiró"
                referrerPolicy="no-referrer"
                className="h-full w-full object-contain rounded-md"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-red-500 font-brand font-black text-xs tracking-tighter">WRF</span>
            )}
          </span>
          <span className="text-base sm:text-lg font-brand font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
            Web Rádio Figueiró<span className="text-red-600">.</span>
          </span>
        </button>

        {/* Zone 2: Clean Typography Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => scrollToSection('multimedia', 'playlist')}
            className="whitespace-nowrap shrink-0 hover:text-slate-950 dark:hover:text-white hover:underline decoration-red-500 decoration-2 underline-offset-8 transition-colors"
          >
            {t.nav.playlist}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('programacao')}
            className="whitespace-nowrap shrink-0 hover:text-slate-950 dark:hover:text-white hover:underline decoration-red-500 decoration-2 underline-offset-8 transition-colors"
          >
            {t.nav.prog}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('galeria')}
            className="whitespace-nowrap shrink-0 hover:text-slate-950 dark:hover:text-white hover:underline decoration-red-500 decoration-2 underline-offset-8 transition-colors"
          >
            {t.nav.gallery}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('noticias')}
            className="whitespace-nowrap shrink-0 hover:text-slate-950 dark:hover:text-white hover:underline decoration-red-500 decoration-2 underline-offset-8 transition-colors"
          >
            {t.nav.news}
          </button>
        </nav>

        {/* Zone 3: Controls & Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language selector (Desktop) */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-white/[0.05] p-1 rounded-xl border border-slate-200 dark:border-white/[0.08]">
            {languages.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => setLanguage(lang.id)}
                className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors whitespace-nowrap shrink-0 ${
                  language === lang.id
                    ? 'bg-slate-900 dark:bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
                aria-label={`Idioma ${lang.label}`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] transition-colors shrink-0"
            title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          >
            {isDark ? (
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Primary Play Action */}
          <button
            type="button"
            onClick={toggleRadioPlay}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 h-9 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
              isRadioPlaying
                ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                : 'bg-slate-900 dark:bg-red-600 hover:bg-slate-800 dark:hover:bg-red-500 text-white'
            }`}
          >
            {isRadioPlaying ? (
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            <span>{isRadioPlaying ? t.nav.onAir : t.nav.listenLive}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.05] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] shrink-0"
            aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0b0e17] border-b border-slate-200 dark:border-white/10 px-4 py-4 space-y-4 shadow-xl">
          <nav className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => scrollToSection('multimedia', 'playlist')}
              className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-left text-sm font-bold text-slate-900 dark:text-white hover:bg-red-50 dark:hover:bg-red-600/15"
            >
              {t.nav.playlist}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('programacao')}
              className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-left text-sm font-bold text-slate-900 dark:text-white hover:bg-red-50 dark:hover:bg-red-600/15"
            >
              {t.nav.prog}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('galeria')}
              className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-left text-sm font-bold text-slate-900 dark:text-white hover:bg-red-50 dark:hover:bg-red-600/15"
            >
              {t.nav.gallery}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('noticias')}
              className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-left text-sm font-bold text-slate-900 dark:text-white hover:bg-red-50 dark:hover:bg-red-600/15"
            >
              {t.nav.news}
            </button>
          </nav>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/[0.05] p-1 rounded-xl border border-slate-200 dark:border-white/[0.08]">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setLanguage(lang.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold ${
                    language === lang.id
                      ? 'bg-slate-900 dark:bg-red-600 text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <a
              href="https://wa.me/351910270085"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap"
            >
              {t.nav.contactBtn}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
