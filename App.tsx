
import React, { useEffect } from 'react';
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
  return (
    <div className="min-h-screen flex flex-col pb-40 text-slate-100">
      
      {/* BACKGROUND OLED COM AURORAS VIBRANTES */}
      <div className="aurora-container">
        <div className="aurora-orb bg-blue-700/20 top-[-20%] left-[-10%] animate-aurora"></div>
        <div className="aurora-orb bg-indigo-800/20 bottom-[-10%] right-[-10%] animate-aurora" style={{ animationDelay: '-10s' }}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05] pointer-events-none"></div>
      </div>

      <Header isDark={true} onToggleTheme={() => {}} />
      <NewsTicker />
      
      <main className="relative z-10 flex-grow container mx-auto px-4 py-12 pt-48 space-y-24 md:space-y-40">
        
        {/* HERO - ANIMAÇÃO INDEPENDENTE PARA GARANTIR VISIBILIDADE */}
        <div className="animate-fade-in-up">
          <Hero />
        </div>
        
        {/* BOTÕES DE ACÇÃO RÁPIDA */}
        <section className="animate-fade-in-up grid grid-cols-1 md:grid-cols-2 gap-6" style={{ animationDelay: '0.2s' }}>
          <a 
            href="https://www.viralagenda.com/pt/porto/amarante" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative overflow-hidden glass-card rounded-[2.5rem] p-8 md:p-10 transition-all"
          >
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-700 rounded-2xl shadow-xl mr-6 transform group-hover:rotate-6 transition-all">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Cultura</p>
                <h4 className="text-2xl md:text-3xl font-brand font-black text-white tracking-tighter">Agenda Amarante</h4>
              </div>
            </div>
          </a>

          <a 
            href="https://www.farmaciasdeservico.net/mapa/3719" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative overflow-hidden glass-card rounded-[2.5rem] p-8 md:p-10 transition-all"
          >
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl shadow-xl mr-6 transform group-hover:-rotate-6 transition-all">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <div>
                <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Utilidade</p>
                <h4 className="text-2xl md:text-3xl font-brand font-black text-white tracking-tighter">Farmácias</h4>
              </div>
            </div>
          </a>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
          <div className="lg:col-span-2 space-y-24 md:space-y-40">
            <section id="programacao" className="animate-fade-in-up scroll-mt-48" style={{ animationDelay: '0.3s' }}>
              <Schedule />
            </section>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <MediaCenter />
            </div>
            <section id="galeria" className="animate-fade-in-up scroll-mt-48" style={{ animationDelay: '0.5s' }}>
              <PhotoGallery />
            </section>
            <section id="parcerias" className="animate-fade-in-up scroll-mt-48" style={{ animationDelay: '0.6s' }}>
              <Partnerships />
            </section>
          </div>
          
          <aside className="space-y-10">
            <div className="sticky top-48 space-y-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <WeatherWidget />
              <RequestCenter />
              <RecentTracks />
              <VisitorCounter />
              <section id="noticias">
                <News />
              </section>
              <section id="contatos">
                <Socials />
              </section>
            </div>
          </aside>
        </div>
      </main>

      <footer className="relative z-10 py-20 border-t border-white/[0.05] text-center mt-40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-brand font-black text-white tracking-tighter mb-2">Web Rádio Figueiró<span className="text-blue-600">.</span></h2>
          <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-500 mb-8">Amarante • Portugal</p>
          <div className="inline-block px-8 py-3 bg-white/[0.03] border border-white/[0.1] rounded-full">
            <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em]">WEBRADIOFIGUEIRO@GMAIL.COM</p>
          </div>
        </div>
      </footer>

      <Player />
    </div>
  );
};

export default App;
