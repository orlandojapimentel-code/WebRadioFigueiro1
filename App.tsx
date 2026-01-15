
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Player from './components/Player';
import Schedule from './components/Schedule';
import GeminiAssistant from './components/GeminiAssistant';
import RecentTracks from './components/RecentTracks';
import Partnerships from './components/Partnerships';
import Socials from './components/Socials';
import News from './components/News';
import VisitorCounter from './components/VisitorCounter';
import AgendaCultural from './components/AgendaCultural';
import PhotoGallery from './components/PhotoGallery';
import WeatherWidget from './components/WeatherWidget';

const App: React.FC = () => {
  const [isAgendaOpen, setIsAgendaOpen] = useState(false);
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
    <div className="min-h-screen flex flex-col pb-32 transition-colors duration-500">
      <Header isDark={isDark} onToggleTheme={toggleTheme} />
      
      <main className="flex-grow container mx-auto px-4 space-y-16 py-8">
        <Hero />
        
        {/* SECÇÃO DE SERVIÇOS AMARANTE (NOVA LOCALIZAÇÃO) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => setIsAgendaOpen(true)}
            className="group relative flex items-center p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-[2.5rem] shadow-xl transition-all hover:-translate-y-1 hover:shadow-indigo-500/20 active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="p-4 bg-white/10 rounded-2xl mr-6">
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/80 mb-1">Eventos Locais</p>
              <h4 className="text-2xl font-black tracking-tight">Agenda Cultural</h4>
            </div>
            <div className="ml-auto bg-amber-500 text-indigo-950 text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg">AMARANTE</div>
          </button>

          <a 
            href="https://www.farmaciasdeservico.net/mapa/3719" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative flex items-center p-8 bg-white dark:bg-white/5 text-slate-900 dark:text-white rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5 transition-all hover:-translate-y-1 hover:border-emerald-500/30 active:scale-[0.98]"
          >
            <div className="p-4 bg-emerald-500/10 rounded-2xl mr-6 transition-colors group-hover:bg-emerald-500/20">
              <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Saúde & Bem-Estar</p>
              <h4 className="text-2xl font-black tracking-tight">Farmácias de Serviço</h4>
            </div>
            <div className="ml-auto text-emerald-500 group-hover:translate-x-1 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </div>
          </a>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <section id="programacao">
              <Schedule />
            </section>
            
            <section id="galeria">
              <PhotoGallery />
            </section>
            
            <section id="parcerias">
              <Partnerships />
            </section>
          </div>
          
          <aside className="space-y-8">
            <WeatherWidget />
            <GeminiAssistant />
            <RecentTracks />
            <VisitorCounter />
            <News />
            <Socials />
          </aside>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 py-12 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
          <p className="font-bold">© {new Date().getFullYear()} Web Rádio Figueiró. Todos os direitos reservados.</p>
          <div className="mt-4 space-y-2">
            <p>
              Email: 
              <button 
                onClick={() => window.location.href = "mailto:webradiofigueiro@gmail.pt"}
                className="ml-1 text-blue-600 dark:text-blue-400 hover:underline"
              >
                webradiofigueiro@gmail.pt
              </button>
            </p>
            <p>Telefone: +351 910270085</p>
          </div>
          <div className="mt-6 flex justify-center space-x-4 opacity-50 grayscale hover:grayscale-0 transition-all">
             <div className="w-8 h-8 rounded-full bg-blue-600"></div>
             <div className="w-8 h-8 rounded-full bg-indigo-600"></div>
          </div>
        </div>
      </footer>

      <Player />
      
      {isAgendaOpen && <AgendaCultural onClose={() => setIsAgendaOpen(false)} />}
    </div>
  );
};

export default App;
