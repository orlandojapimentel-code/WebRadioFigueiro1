
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Player from './components/Player';
import Schedule from './components/Schedule';
import RequestCenter from './components/RequestCenter';
import RecentTracks from './components/RecentTracks';
import Partnerships from './components/Partnerships';
import Socials from './components/Socials';
import News from './components/News';
import VisitorCounter from './components/VisitorCounter';
import PhotoGallery from './components/PhotoGallery';
import WeatherWidget from './components/WeatherWidget';
import MediaCenter from './components/MediaCenter';
import NewsTicker from './components/NewsTicker';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('wrf_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('wrf_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('wrf_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className={`min-h-screen flex flex-col pb-40 transition-all duration-1000 ${isDark ? 'mesh-gradient' : 'bg-[#f8fafc]'} selection:bg-blue-600 selection:text-white`}>
      {/* Elementos Decorativos Flutuantes (Blobs) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] -left-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-[20%] -right-20 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <Header isDark={isDark} onToggleTheme={toggleTheme} />
      <NewsTicker />
      
      <main className="relative z-10 flex-grow container mx-auto px-4 py-12 pt-48 space-y-40">
        <Hero />
        
        {/* SERVIÇOS PREMIUM COM DESIGN RESPONSIVO MELHORADO */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <a 
            href="https://www.viralagenda.com/pt/porto/amarante" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative overflow-hidden p-1 rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-purple-500/20"
          >
            <div className="relative h-full flex items-center p-6 md:p-10 bg-[#0a0a23]/90 backdrop-blur-3xl rounded-[2.3rem] md:rounded-[3.3rem] overflow-hidden">
              <div className="relative z-10 p-4 md:p-6 bg-gradient-to-br from-amber-400 to-orange-600 rounded-[1.5rem] md:rounded-[2.2rem] shadow-2xl mr-4 md:mr-10 transform group-hover:rotate-6 transition-transform duration-500 shrink-0">
                <svg className="w-8 h-8 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div className="relative z-10 min-w-0">
                <p className="text-amber-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-1 md:mb-2 truncate">Descubra Amarante</p>
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-brand font-black text-white tracking-tighter leading-none mb-1 truncate">Agenda Cultural</h4>
                <div className="w-8 md:w-12 h-1 bg-amber-500/50 rounded-full transition-all group-hover:w-full"></div>
              </div>
            </div>
          </a>

          <a 
            href="https://www.farmaciasdeservico.net/mapa/3719" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative overflow-hidden p-1 rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-emerald-500/20"
          >
            <div className="relative h-full flex items-center p-6 md:p-10 bg-[#020d11]/90 backdrop-blur-3xl rounded-[2.3rem] md:rounded-[3.3rem] overflow-hidden">
              <div className="relative z-10 p-4 md:p-6 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-[1.5rem] md:rounded-[2.2rem] shadow-2xl mr-4 md:mr-10 transform group-hover:-rotate-6 transition-transform duration-500 shrink-0">
                <svg className="w-8 h-8 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <div className="relative z-10 min-w-0">
                <p className="text-emerald-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-1 md:mb-2 truncate">Saúde 24h</p>
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-brand font-black text-white tracking-tighter leading-none mb-1 truncate">Farmácias</h4>
                <div className="w-8 md:w-12 h-1 bg-emerald-500/50 rounded-full transition-all group-hover:w-full"></div>
              </div>
            </div>
          </a>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-24 relative">
          <div className="lg:col-span-2 space-y-24 md:space-y-40">
            <section id="programacao" className="scroll-mt-48">
              <Schedule />
            </section>
            
            <MediaCenter />

            <section id="galeria" className="scroll-mt-48">
              <PhotoGallery />
            </section>
            
            <section id="parcerias" className="scroll-mt-48">
              <Partnerships />
            </section>
          </div>
          
          <aside className="space-y-12 md:space-y-16">
            <div className="sticky top-48 space-y-12 md:space-y-16">
              <WeatherWidget />
              <RequestCenter />
              <RecentTracks />
              <VisitorCounter />
              <section id="noticias" className="scroll-mt-40">
                <News />
              </section>
              <section id="contatos" className="scroll-mt-40">
                <Socials />
              </section>
            </div>
          </aside>
        </div>
      </main>

      <footer className="relative z-10 bg-white/5 dark:bg-black/40 backdrop-blur-3xl py-16 md:py-24 border-t border-white/5 text-center mt-40">
        <div className="container mx-auto px-4 space-y-10">
          <div className="flex justify-center space-x-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-blue-600/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
            ))}
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-brand font-black text-slate-900 dark:text-white tracking-tighter">Web Rádio Figueiró<span className="text-blue-600">.</span></h2>
            <p className="font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[8px] md:text-[10px] text-slate-400">Desde 2022 a elevar a voz de Figueiró - Amarante</p>
          </div>
          <div className="max-w-md mx-auto p-6 md:p-8 rounded-[2rem] bg-white/5 border border-white/5">
            <p className="text-[10px] font-black tracking-[0.3em] text-blue-500 uppercase mb-4">Contactos Oficiais</p>
            <p className="text-base md:text-lg font-bold text-slate-800 dark:text-gray-200 truncate">WEBRADIOFIGUEIRO@GMAIL.COM</p>
            <p className="text-xl md:text-2xl font-brand font-black text-blue-600 mt-2">+351 910 270 085</p>
          </div>
        </div>
      </footer>

      <Player />
    </div>
  );
};

export default App;
