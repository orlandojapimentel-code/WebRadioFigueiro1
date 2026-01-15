
import React, { useState, useEffect } from 'react';

interface VideoItem {
  id: string;
  title: string;
  youtubeId: string;
}

interface AudioItem {
  id: string;
  title: string;
  date: string;
  audioUrl: string;
}

const MediaCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // NOTA: Substitua estes IDs 'dQw4w9WgXcQ' pelos IDs reais dos seus vídeos.
  // O ID é o que aparece depois de 'v=' no link do YouTube.
  const videos: VideoItem[] = [
    { id: '1', title: "Ás da Concertina em Direto", youtubeId: "dQw4w9WgXcQ" }, 
    { id: '2', title: "Grande Gala Web Rádio Figueiró", youtubeId: "dQw4w9WgXcQ" },
  ];

  const audios: AudioItem[] = [
    { 
      id: '1', 
      title: "Entrevista Especial: Ás da Concertina e Vasquinho da Concertina", 
      date: "Destaque Popular", 
      audioUrl: "https://docs.google.com/uc?export=download&id=16FYy1TR8z1qI1UOpkeqSPYs2-RsEv0Gl" 
    },
    { 
      id: '2', 
      title: "Prazeres Interrompidos - Promo", 
      date: "Podcast", 
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" 
    },
  ];

  return (
    <section id="multimedia" className="space-y-8 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-white/5 pb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Centro Multimédia</h3>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Conteúdos Exclusivos</p>
          </div>
        </div>

        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
          <button 
            onClick={() => setActiveTab('video')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'video' ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-400 hover:text-blue-600'}`}
          >
            Vídeos
          </button>
          <button 
            onClick={() => setActiveTab('audio')}
            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'audio' ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-400 hover:text-blue-600'}`}
          >
            Entrevistas
          </button>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'video' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="group relative bg-gray-900 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
                <div className="aspect-video w-full bg-black flex items-center justify-center">
                  <iframe 
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.youtubeId}?origin=${origin}&enablejsapi=1&rel=0`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  ></iframe>
                </div>
                <div className="p-6 bg-gradient-to-t from-gray-950 to-transparent">
                  <h4 className="text-white font-bold text-lg tracking-tight">{video.title}</h4>
                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-1">YouTube WRF</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {audios.map((audio) => (
              <div key={audio.id} className="bg-white dark:bg-gray-800/40 p-6 rounded-[2.5rem] border border-gray-200 dark:border-white/5 flex flex-col md:flex-row items-center gap-6 group hover:border-blue-500/30 transition-all shadow-lg">
                <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div className="flex-grow text-center md:text-left">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{audio.date}</p>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{audio.title}</h4>
                </div>
                <div className="w-full md:w-auto">
                  <audio controls className="w-full md:w-64 h-10 accent-blue-600">
                    <source src={audio.audioUrl} type="audio/mpeg" />
                    Browser incompatível.
                  </audio>
                </div>
              </div>
            ))}
            
            <div className="bg-blue-600/5 rounded-2xl p-4 text-center border border-blue-500/10">
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">
                Os nossos áudios estão alojados com segurança e prontos a ouvir.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MediaCenter;
