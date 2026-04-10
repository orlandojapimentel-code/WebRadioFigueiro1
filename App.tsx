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
import { LanguageProvider } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const [showAgenda, setShowAgenda] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col pb-28 sm:pb-40 transition-colors duration-500 selection:bg-red-600/30">
      <div className="aurora-container">
        <div className="aurora-orb bg-red-600/10 top-[-10%] left-[-10%] animate-aurora"></div>
        <div className="aurora-orb bg-blue-600/10 bottom-[-10%] right-[-10%] animate-aurora" style={{ animationDelay: '-10s' }}></div>
      </div>

      <Header isDark={isDark} onToggleTheme={toggleTheme} />
      <NewsTicker />
      
      <main className="relative z-10 flex-grow container mx-auto px-4 py-8 sm:py-12 pt-[140px] sm:pt-[160px] space-y-16 md:space-y-24">
        <Hero />
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <button onClick={() => {
            window.dispatchEvent(new CustomEvent('close-overlays'));
            setShowAgenda(true);
          }} className="group relative overflow-hidden bg-gradient-to-br from-orange-600 to-red-800 rounded-3xl p-8 sm:p-12 transition-all shadow-2xl hover:scale-[1.03] text-left border border-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
            <div className="flex items-center relative z-10">
              <div className="p-4 sm:p-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl mr-6 sm:mr-8 transform group-hover:rotate-6 transition-all">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <p className="text-white/70 text-[10px] sm:text-[12px] font-black uppercase tracking-[0.3em] mb-1">Cultura & Eventos</p>
                <h4 className="text-2xl sm:text-4xl font-brand font-black text-white tracking-tighter">Agenda Amarante</h4>
              </div>
            </div>
          </button>
          <a href="https://www.farmaciasdeservico.net/mapa/3719" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-900 rounded-3xl p-8 sm:p-12 transition-all shadow-2xl hover:scale-[1.03] border border-white/10">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -ml-16 -mb-16 group-hover:scale-150 transition-transform"></div>
            <div className="flex items-center relative z-10">
              <div className="p-4 sm:p-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl mr-6 sm:mr-8 transform group-hover:-rotate-6 transition-all">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <div>
                <p className="text-white/70 text-[10px] sm:text-[12px] font-black uppercase tracking-[0.3em] mb-1">Saúde & Utilidade</p>
                <h4 className="text-2xl sm:text-4xl font-brand font-black text-white tracking-tighter">Farmácias de Serviço</h4>
              </div>
            </div>
          </a>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
          <div className="lg:col-span-2 space-y-24 md:space-y-40">
            <section id="programacao" className="scroll-mt-48"><Schedule /></section>
            <section id="galeria" className="scroll-mt-48"><PhotoGallery /></section>
            <MediaCenter />
            <NewsSection />
          </div>
          <aside className="space-y-10">
            <div className="sticky top-48 space-y-10">
              <WeatherWidget />
              <Playlist />
              <RequestCenter />
              <VisitorCounter />
            </div>
          </aside>
        </div>

        <Partnerships />
      </main>

      <footer className="relative z-10 py-12 border-t border-white/5 text-center mt-20 bg-black/40 backdrop-blur-3xl">
        <div className="container mx-auto px-4 space-y-8">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-brand font-black text-white tracking-tighter mb-2">Web Rádio Figueiró<span className="text-red-600">.</span></h2>
            <p className="font-black uppercase tracking-[0.4em] text-[8px] text-slate-500">Amarante • Portugal</p>
          </div>

          <div className="flex justify-center">
            <SocialMedia />
          </div>
          
          <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
            <div className="flex -space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/40"></div>
              ))}
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Emissão Digital Certificada
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
