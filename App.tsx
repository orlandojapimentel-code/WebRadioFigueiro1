
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
        <Hero onOpenAgenda={() => setIsAgendaOpen(true)} />
        
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
