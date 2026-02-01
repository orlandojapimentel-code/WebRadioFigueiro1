
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
    window.scrollTo(0, 0);
  }, []);

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
    <div className="min-h-screen flex flex-col pb-32 transition-colors duration-500 bg-slate-50 dark:bg-[#020617]">
      <Header isDark={isDark} onToggleTheme={toggleTheme} />
      <NewsTicker />
      
      <main className="flex-grow container mx-auto px-4 space-y-16 py-12 pt-24">
        <Hero />
        
        {/* SECÇÃO DE SERVIÇOS PREMIUM */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Agenda Cultural - Premium Design */}
          <a 
            href="https://www.viralagenda.com/pt/porto/amarante" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative overflow-hidden flex items-center p-1 rounded-[2.8rem] bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-700 shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="relative w-full h-full flex items-center p-8 bg-[#0a0a23] rounded-[2.6rem] overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-600/20 blur-3xl group-hover:bg-indigo-600/40 transition-all duration-700"></div>
              
              <div className="relative z-10 p-5 bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl shadow-xl mr-8 transform group-hover:rotate-6 transition-transform duration-500">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>

              <div className="relative z-10 flex-grow">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/90">Atualizado Agora</p>
                </div>
                <h4 className="text-3xl font-brand font-black text-white tracking-tighter leading-none mb-1">Agenda Cultural</h4>
                <p className="text-slate-400 text-sm font-medium">Os melhores eventos de Amarante</p>
              </div>

              <div className="relative z-10 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                <div className="p-3 bg-white/10 rounded-full text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </div>
              </div>
            </div>
          </a>

          {/* Farmácias - Professional Design */}
          <a 
            href="https://www.farmaciasdeservico.net/mapa/3719" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative flex items-center p-1 rounded-[2.8rem] bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-500 shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="relative w-full h-full flex items-center p-8 bg-white dark:bg-[#020617] rounded-[2.6rem] overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10 p-5 bg-emerald-50 dark:bg-emerald-500/10 rounded-3xl mr-8 transition-colors group-hover:bg-emerald-500 group-hover:text-white border border-emerald-100 dark:border-emerald-500/20">
                <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>

              <div className="relative z-10 flex-grow">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-400 mb-2">Saúde 24 Horas</p>
                <h4 className="text-3xl font-brand font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1">Farmácias</h4>
                <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Serviço permanente em Amarante</p>
              </div>

              <div className="relative z-10 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500">
                <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full text-emerald-600 dark:text-emerald-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </div>
              </div>
            </div>
          </a>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <section id="programacao">
              <Schedule />
            </section>
            
            <MediaCenter />

            <section id="galeria">
              <PhotoGallery />
            </section>
            
            <section id="parcerias">
              <Partnerships />
            </section>
          </div>
          
          <aside className="space-y-8">
            <WeatherWidget />
            <RequestCenter />
            <RecentTracks />
            <VisitorCounter />
            <News />
            <Socials />
          </aside>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 py-12 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
          <p className="font-bold uppercase tracking-widest text-[10px]">© {new Date().getFullYear()} Web Rádio Figueiró • Todos os direitos reservados</p>
          <div className="mt-4 space-y-2">
            <p className="text-xs uppercase font-bold">Email: webradiofigueiro@gmail.pt</p>
            <p className="text-xs uppercase font-bold text-blue-600">Telefone/WhatsApp: +351 910270085</p>
          </div>
        </div>
      </footer>

      <Player />
    </div>
  );
};

export default App;
