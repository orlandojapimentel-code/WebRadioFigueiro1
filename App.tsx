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

const AppContent: React.FC = () => {
  const { t } = useLanguage();
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
      
      <main className="relative z-10 flex-grow container mx-auto px-4 py-8 sm:py-12 pt-[140px] sm:pt-[160px] space-y-24">
        <Hero />
        
        {/* Bento Grid Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(320px,auto)]">
          {/* Agenda Cultural - Large Item */}
          <div className="md:col-span-8 bento-item group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-orange-600/20 transition-all duration-700"></div>
            <div className="flex flex-col h-full relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-6">
                  <div className="p-5 bg-orange-600/10 backdrop-blur-md border border-orange-500/20 rounded-3xl shadow-xl transform group-hover:rotate-6 transition-all duration-500">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter text-white">Agenda Cultural</h3>
                    <p className="text-orange-500/80 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Eventos & Cultura</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('close-overlays'));
                    setShowAgenda(true);
                  }}
                  className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
                >
                  Explorar
                </button>
              </div>
              <div className="flex-grow">
                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl font-medium">
                  Fique a par de todos os eventos culturais, concertos e festividades na região de Amarante. A nossa agenda é atualizada diariamente para não perder nada.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-[#02020a] bg-slate-800 overflow-hidden">
                      <img src={`https://picsum.photos/seed/event${i}/100/100`} alt="Event" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-[#02020a] bg-orange-600 flex items-center justify-center text-[10px] font-black">+12</div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Próximo Evento</p>
                  <p className="text-white font-bold">Festas de Junho</p>
                </div>
              </div>
            </div>
          </div>

          {/* Destaques Semanais - Small Vertical Item */}
          <div className="md:col-span-4 bento-item group bg-gradient-to-br from-purple-600/10 to-pink-900/10 border-purple-500/20">
            <div className="flex flex-col h-full relative z-10">
              <div className="p-5 bg-purple-600/10 border border-purple-500/20 rounded-3xl w-fit mb-8 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-3xl font-black tracking-tighter text-white mb-6">Destaques</h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                  <h4 className="text-purple-400 font-black text-xs uppercase tracking-widest mb-1">Night Grooves</h4>
                  <p className="text-white font-bold text-sm">Domingos, 22:00 - 00:00</p>
                  <p className="text-slate-500 text-[10px] mt-1">1ª Hora: DJ Durval | 2ª Hora: DJ Convidado</p>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                  <h4 className="text-pink-400 font-black text-xs uppercase tracking-widest mb-1">Prazeres Interrompidos</h4>
                  <p className="text-white font-bold text-sm">Quartas e Sextas, 13:00</p>
                  <p className="text-slate-500 text-[10px] mt-1">Repetição às 20:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Farmácias - Small Item */}
          <div className="md:col-span-4 bento-item group border-blue-500/20">
            <div className="flex flex-col h-full relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-blue-600/10 rounded-xl">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">Farmácias</h3>
              </div>
              <p className="text-slate-400 text-xs font-medium mb-6">Consulte as farmácias de serviço em Amarante em tempo real.</p>
              <a href="https://www.farmaciasdeservico.net/mapa/3719" target="_blank" rel="noopener noreferrer" className="mt-auto py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-center text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">
                Ver Mapa
              </a>
            </div>
          </div>

          {/* Galeria - Medium Item */}
          <div className="md:col-span-8 bento-item group">
            <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
              <img src="https://images.unsplash.com/photo-1514525253361-bee8718a74a2?q=80&w=1000&auto=format&fit=crop" alt="Gallery Preview" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-black tracking-tighter text-white">{t.nav.gallery}</h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Momentos WRF</p>
                </div>
              </div>
              <div className="mt-auto">
                <PhotoGallery />
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-24">
            <section id="programacao" className="scroll-mt-48"><Schedule /></section>
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
