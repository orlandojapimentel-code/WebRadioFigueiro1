import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Schedule from './components/Schedule';
import RequestCenter from './components/RequestCenter';
import PhotoGallery from './components/PhotoGallery';
import AgendaCultural from './components/AgendaCultural';
import NewsSection from './components/NewsSection';
import Player from './components/Player';
import NewsTicker from './components/NewsTicker';
import MediaCenter from './components/MediaCenter';
import WeatherWidget from './components/WeatherWidget';
import VisitorCounter from './components/VisitorCounter';
import Playlist from './components/Playlist';
import SocialMedia from './components/SocialMedia';
import Partnerships from './components/Partnerships';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { fetchCulturalEvents } from './services/geminiService';
import { MEDIA_ASSETS } from './src/mediaAssets';

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const [showAgenda, setShowAgenda] = useState(false);
  const [nextEventTitle, setNextEventTitle] = useState<string>(t.bento.loading);
  const [nextEventDate, setNextEventDate] = useState<string>('');

  useEffect(() => {
    const loadNextEvent = async () => {
      try {
        const result = await fetchCulturalEvents();
        if (result && result.text) {
          const eventBlocks = result.text.match(/EVENTO_START[\s\S]*?EVENTO_END/g);
          if (eventBlocks && eventBlocks.length > 0) {
            const block = eventBlocks[0];
            const extract = (key: string) => {
              const regex = new RegExp(`${key}:\\s*(.*)`, 'i');
              const match = block.match(regex);
              return match ? match[1].trim().replace(/[*`]/g, '') : '';
            };
            const title = extract('TITULO');
            const dateStr = extract('DATA');
            setNextEventTitle(title || t.bento.fallbackEventTitle);
            setNextEventDate(dateStr || t.bento.fallbackEventDate);
            return;
          }
        }
        setNextEventTitle(t.bento.fallbackEventTitle);
        setNextEventDate(t.bento.fallbackEventDate);
      } catch {
        setNextEventTitle(t.bento.fallbackEventTitle);
        setNextEventDate(t.bento.fallbackEventDate);
      }
    };
    loadNextEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    const handleCloseOverlays = (e: Event) => {
      const detail = (e as CustomEvent<{ source?: string }>).detail;
      if (detail?.source !== 'agenda') {
        setShowAgenda(false);
      }
    };
    window.addEventListener('close-overlays', handleCloseOverlays);
    return () => {
      window.removeEventListener('close-overlays', handleCloseOverlays);
    };
  }, []);

  const handleOpenAgenda = () => {
    window.dispatchEvent(new CustomEvent('close-overlays', { detail: { source: 'agenda' } }));
    setShowAgenda(true);
  };

  return (
    <div className="min-h-screen flex flex-col pb-28 sm:pb-32 bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Header isDark={isDark} onToggleTheme={toggleTheme} />
      <NewsTicker />

      <main className="relative z-10 flex-grow container mx-auto max-w-7xl px-4 sm:px-6 pt-28 sm:pt-32 space-y-12 sm:space-y-16">
        <Hero />

        {/* Bento Grid Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Agenda Cultural */}
          <div className="md:col-span-8 glass-card glass-card-interactive p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-[0.2em] block">
                  {t.bento.agendaKicker}
                </span>
                <h3 className="text-2xl sm:text-3xl font-brand font-black tracking-tight text-slate-900 dark:text-white mt-1">
                  {t.bento.agendaTitle}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleOpenAgenda}
                className="relative z-10 self-start px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.bento.agendaCta}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              <div className="sm:col-span-5 h-36 sm:h-40 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-200 dark:bg-slate-900">
                <img
                  src={MEDIA_ASSETS.culturalEventsStage}
                  alt={t.bento.agendaTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="sm:col-span-7 space-y-3">
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                  {t.bento.agendaDesc}
                </p>
                <div className="pt-3 border-t border-slate-200 dark:border-white/[0.08]">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    {t.bento.nextHighlight}
                  </span>
                  <p className="text-slate-900 dark:text-white font-bold text-sm truncate mt-0.5">
                    {nextEventTitle}
                  </p>
                  {nextEventDate && (
                    <p className="text-red-600 dark:text-red-400 text-xs font-semibold">
                      {nextEventDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Station Highlights */}
          <div className="md:col-span-4 glass-card glass-card-interactive p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-[0.2em] block">
                {t.bento.highlightsKicker}
              </span>
              <h3 className="text-xl font-brand font-black text-slate-900 dark:text-white tracking-tight mt-1 mb-5">
                {t.bento.highlightsTitle}
              </h3>

              <div className="divide-y divide-slate-200 dark:divide-white/[0.08]">
                <div className="pb-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-brand font-bold text-slate-900 dark:text-white">
                      Night Grooves
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                      22:00 – 00:00
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                    {t.bento.nightGroovesSub}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {t.bento.nightGroovesDesc}
                  </p>
                </div>

                <div className="pt-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-brand font-bold text-slate-900 dark:text-white">
                      Prazeres Interrompidos
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                      13:00 / 20:00
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                    {t.bento.prazeresSub}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {t.bento.prazeresDesc}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/[0.08]">
              <a
                href="#programacao"
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1"
              >
                <span>{t.bento.viewFullSchedule}</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Farmácias de Turno */}
          <div className="md:col-span-4 glass-card glass-card-interactive p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-[0.2em] block">
                {t.bento.pharmacyKicker}
              </span>
              <h3 className="text-xl font-brand font-black text-slate-900 dark:text-white tracking-tight mt-1 mb-3">
                {t.bento.pharmacyTitle}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                {t.bento.pharmacyDesc}
              </p>
            </div>

            <a
              href="https://www.farmaciasdeservico.net/mapa/3719"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto py-3 px-4 bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white rounded-xl text-center text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <span>{t.bento.pharmacyCta}</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Galeria */}
          <div id="galeria" className="md:col-span-8 scroll-mt-32 glass-card glass-card-interactive p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-[0.2em] block">
                  {t.bento.galleryKicker}
                </span>
                <h3 className="text-2xl sm:text-3xl font-brand font-black tracking-tight text-slate-900 dark:text-white mt-1">
                  {t.bento.galleryTitle}
                </h3>
              </div>
            </div>

            <PhotoGallery />
          </div>
        </section>

        {/* Main Two-Column Body: Schedule + Media + News & Utility Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 items-start">
          <div className="lg:col-span-2 space-y-14 sm:space-y-16">
            <section id="programacao" className="scroll-mt-32">
              <Schedule />
            </section>
            <MediaCenter />
            <NewsSection />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <WeatherWidget />
            <Playlist />
            <RequestCenter />
            <VisitorCounter />
          </aside>
        </div>

        <Partnerships />
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="relative z-10 py-10 sm:py-12 border-t border-slate-200 dark:border-white/[0.08] text-center mt-16 bg-white dark:bg-[#07090e] transition-colors">
        <div className="container mx-auto px-4 space-y-6 max-w-5xl">
          <div className="flex flex-col items-center">
            <h2 className="text-xl sm:text-2xl font-brand font-black text-slate-900 dark:text-white tracking-tight mb-1">
              Web Rádio Figueiró<span className="text-red-600">.</span>
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.footer.tagline}
            </p>
          </div>

          <div className="flex justify-center">
            <SocialMedia />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-white/5">
            <span>{t.footer.certified}</span>
            <span aria-hidden="true">·</span>
            <span>
              © {new Date().getFullYear()} {t.footer.rights}
            </span>
          </div>
        </div>
      </footer>

      <Player />
      {showAgenda && <AgendaCultural onClose={() => setShowAgenda(false)} />}
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
