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

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const [showAgenda, setShowAgenda] = useState(false);
  const [nextEventTitle, setNextEventTitle] = useState<string>("Carregando...");
  const [nextEventDate, setNextEventDate] = useState<string>("");

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
              return match ? match[1].trim().replace(/[*`]/g, '') : "";
            };
            const title = extract('TITULO');
            const dateStr = extract('DATA');
            setNextEventTitle(title || "Jornadas do Património - Rota dos Moinhos");
            setNextEventDate(dateStr || "25 a 27 de Setembro");
            return;
          }
        }
        setNextEventTitle("Jornadas do Património - Rota dos Moinhos");
        setNextEventDate("25 a 27 de Setembro");
      } catch (err) {
        console.warn("Notice loading next event badge:", err);
        setNextEventTitle("Jornadas do Património - Rota dos Moinhos");
        setNextEventDate("25 a 27 de Setembro");
      }
    };
    loadNextEvent();
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
    const handleCloseOverlays = () => {
      setShowAgenda(false);
    };
    window.addEventListener('close-overlays', handleCloseOverlays);
    return () => {
      window.removeEventListener('close-overlays', handleCloseOverlays);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-32 sm:pb-44 transition-colors duration-500 selection:bg-red-600/30">
      <div className="aurora-container pointer-events-none">
        <div className="aurora-orb bg-red-600/10 top-[-10%] left-[-10%] animate-aurora"></div>
        <div className="aurora-orb bg-blue-600/10 bottom-[-10%] right-[-10%] animate-aurora" style={{ animationDelay: '-10s' }}></div>
      </div>

      <Header isDark={isDark} onToggleTheme={toggleTheme} />
      <NewsTicker />
      
      <main className="relative z-10 flex-grow container mx-auto px-4 sm:px-6 py-6 sm:py-10 pt-[135px] sm:pt-[155px] space-y-16 sm:space-y-24">
        <Hero />
        
        {/* Bento Grid Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)]">
          
          {/* Agenda Cultural - Large Item */}
          <div className="md:col-span-8 glass-card glass-card-interactive p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-orange-600/25 transition-all duration-700 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4 sm:space-x-5">
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl shadow-lg transform group-hover:scale-105 transition-all duration-300">
                    <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] block">
                      Eventos & Tradição
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-brand font-black tracking-tight text-white mt-0.5">
                      Agenda Cultural
                    </h3>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('close-overlays'));
                    setShowAgenda(true);
                  }}
                  className="self-start sm:self-auto px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md shadow-orange-600/25 hover:scale-105 active:scale-95 flex items-center space-x-2"
                >
                  <span>Explorar Agenda</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>

              <div className="flex-grow py-2">
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                  Fique a par de todos os eventos culturais, concertos, festas populares e iniciativas em Amarante e no Tâmega. Atualizado com eventos locais selecionados.
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-9 h-9 rounded-full border-2 border-[#0b0e17] bg-slate-800 overflow-hidden shadow">
                        <img src={`https://picsum.photos/seed/event${i}/100/100`} alt="Evento" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    +15 eventos listados
                  </span>
                </div>

                <div className="text-left sm:text-right bg-black/30 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none w-full sm:w-auto border border-white/5 sm:border-0">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Próximo Destaque</span>
                  <p className="text-white font-bold text-xs sm:text-sm truncate max-w-xs">{nextEventTitle}</p>
                  {nextEventDate && <p className="text-orange-400 text-[11px] font-semibold">{nextEventDate}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Destaques Semanais - Small Vertical Item */}
          <div className="md:col-span-4 glass-card glass-card-interactive p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest block">Emissão Especial</span>
                  <h3 className="text-xl font-brand font-black text-white tracking-tight">Destaques da Rádio</h3>
                </div>
              </div>
              
              <div className="space-y-4 my-auto">
                <div className="p-4 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl border border-white/[0.06] transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-purple-400 font-black text-[10px] uppercase tracking-wider">Night Grooves</span>
                    <span className="text-[10px] text-slate-400 font-mono">22:00 - 00:00</span>
                  </div>
                  <p className="text-white font-bold text-xs">Domingos ao vivo</p>
                  <p className="text-slate-400 text-[10px] mt-1">1ª Hora: DJ Durval | 2ª Hora: Convidado</p>
                </div>

                <div className="p-4 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl border border-white/[0.06] transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-pink-400 font-black text-[10px] uppercase tracking-wider">Prazeres Interrompidos</span>
                    <span className="text-[10px] text-slate-400 font-mono">13:00 / 20:00</span>
                  </div>
                  <p className="text-white font-bold text-xs">Quartas e Sextas</p>
                  <p className="text-slate-400 text-[10px] mt-1">Crónicas literárias & Música de autor</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.06] text-center">
                <a href="#programacao" className="text-[10px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest transition-colors inline-flex items-center space-x-1">
                  <span>Ver Grelha Completa</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Farmácias - Small Item */}
          <div className="md:col-span-4 glass-card glass-card-interactive p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block">Serviço Público</span>
                  <h3 className="text-xl font-brand font-black text-white tracking-tight">Farmácias</h3>
                </div>
              </div>
              
              <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed mb-6">
                Consulte em tempo real as farmácias de serviço e piquetes abertos na região de Amarante.
              </p>

              <a 
                href="https://www.farmaciasdeservico.net/mapa/3719" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-auto py-3 px-4 bg-white/[0.04] hover:bg-emerald-500/10 hover:border-emerald-500/30 text-white rounded-xl text-center text-xs font-black uppercase tracking-wider border border-white/10 transition-all flex items-center justify-center space-x-2"
              >
                <span>Ver Farmácias de Turno</span>
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>
            </div>
          </div>

          {/* Galeria - Medium Item */}
          <div className="md:col-span-8 glass-card glass-card-interactive p-6 sm:p-8 relative overflow-hidden group">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block">Estúdio & Eventos</span>
                  <h3 className="text-2xl sm:text-3xl font-brand font-black tracking-tight text-white mt-0.5">
                    {t.nav.gallery}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-bold bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  Momentos WRF
                </span>
              </div>
              
              <div className="mt-auto">
                <PhotoGallery />
              </div>
            </div>
          </div>

        </section>

        {/* Schedule & Media Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          <div className="lg:col-span-2 space-y-16 sm:space-y-24">
            <section id="programacao" className="scroll-mt-48">
              <Schedule />
            </section>
            <MediaCenter />
            <NewsSection />
          </div>
          
          <aside className="space-y-8">
            <div className="sticky top-32 space-y-8">
              <WeatherWidget />
              <Playlist />
              <RequestCenter />
              <VisitorCounter />
            </div>
          </aside>
        </div>

        <Partnerships />
      </main>

      {/* Modern Footer */}
      <footer className="relative z-10 py-12 sm:py-16 border-t border-white/[0.08] text-center mt-20 bg-[#07090e]/80 backdrop-blur-2xl">
        <div className="container mx-auto px-4 space-y-8 max-w-5xl">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-brand font-black text-white tracking-tighter mb-2">
              Web Rádio Figueiró<span className="text-red-600">.</span>
            </h2>
            <p className="font-black uppercase tracking-[0.35em] text-[9px] sm:text-[10px] text-slate-400">
              A Voz do Vale do Tâmega • Amarante, Portugal
            </p>
          </div>

          <div className="flex justify-center">
            <SocialMedia />
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-4 border-t border-white/5">
            <span className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Emissão Digital Certificada 24/7</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px]">© {new Date().getFullYear()} Web Rádio Figueiró. Todos os direitos reservados.</span>
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
