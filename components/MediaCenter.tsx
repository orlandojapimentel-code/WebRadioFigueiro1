
import React, { useState, useEffect, useRef } from 'react';

interface AudioItem {
  id: string;
  title: string;
  category: string;
  audioUrl: string;
  duration?: string;
  colorClass: string;
  accentColor: string;
}

const CustomAudioPlayer: React.FC<{ audio: AudioItem }> = ({ audio }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  return (
    <div className={`relative overflow-hidden group rounded-[2.5rem] p-7 transition-all duration-500 border hover:shadow-2xl ${audio.colorClass} hover:-translate-y-2`}>
      <audio 
        ref={audioRef} 
        src={audio.audioUrl} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={() => setIsPlaying(false)}
      />
      
      {/* Background Decorativo Animado */}
      <div className={`absolute -right-12 -top-12 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 ${audio.accentColor}`}></div>
      
      <div className="relative z-10 flex items-center space-x-6">
        {/* Play Button Colorido */}
        <button 
          onClick={togglePlay}
          className={`h-16 w-16 shrink-0 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-xl ${
            isPlaying 
            ? 'bg-white text-slate-900 scale-95 ring-4 ring-white/20' 
            : 'bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-slate-900'
          }`}
        >
          {isPlaying ? (
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-black/20 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/10">
              {audio.category}
            </span>
            {isPlaying && (
              <div className="flex space-x-1 h-3 items-end">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-0.5 bg-white animate-bounce`} style={{ height: `${20 + Math.random() * 80}%`, animationDuration: `${0.5 + Math.random()}s` }}></div>
                ))}
              </div>
            )}
          </div>
          <h4 className="text-white font-black text-lg md:text-xl leading-tight tracking-tighter line-clamp-2">
            {audio.title}
          </h4>
        </div>
      </div>

      <div className="mt-8 flex flex-col space-y-3 relative z-10">
        <div className="relative h-2 w-full bg-black/20 rounded-full overflow-hidden border border-white/5">
          <div 
            className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-white/50">
           <span className={isPlaying ? 'text-white animate-pulse' : ''}>{isPlaying ? 'Sintonizado' : 'Offline'}</span>
           <span className="text-white/80">{audio.duration}</span>
        </div>
      </div>
    </div>
  );
};

const MediaCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('audio');

  const audios: AudioItem[] = [
    { 
      id: '1', 
      title: "Entrevista: Ás da Concertina e Vasquinho da Concertina", 
      category: "Tradição Viva", 
      audioUrl: "https://www.dropbox.com/scl/fi/u3r7msk0h6blqpjt8mrba/Entrevista-s-da-concertina-e-Vasquinho-24-01-2025.mp3?rlkey=2sb2suromeylsn0yiwoyc67mn&st=qhx3c6fq&raw=1",
      duration: "1h 21min",
      colorClass: "bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400/30",
      accentColor: "bg-amber-300"
    },
    { 
      id: '2', 
      title: "Prazeres Interrompidos - Promo", 
      category: "Podcast Literário", 
      audioUrl: "https://www.dropbox.com/scl/fi/tz8ccze2co79c16pwq1jp/PROMO-Web-R-dio-Figueir.mp3?rlkey=88lpwhzqnl845jn86g4b4b7ai&st=try9kss2&raw=1",
      duration: "0:30 seg",
      colorClass: "bg-gradient-to-br from-purple-600 to-indigo-800 border-purple-500/30",
      accentColor: "bg-purple-400"
    },
  ];

  return (
    <div id="multimedia" className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-200 dark:border-white/5 pb-10">
        <div className="flex items-center space-x-5">
          <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[1.5rem] shadow-2xl shadow-blue-500/20 rotate-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Explorar Media</h3>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.4em] mt-2 flex items-center">
               <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-ping"></span>
               Conteúdos de Alta Fidelidade
            </p>
          </div>
        </div>

        <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-[1.8rem] border border-gray-200 dark:border-white/10 shadow-inner">
          <button 
            onClick={() => setActiveTab('video')}
            className={`px-10 py-3.5 rounded-[1.3rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === 'video' ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xl scale-105' : 'text-slate-500 dark:text-gray-400 hover:text-blue-600'}`}
          >
            Vídeos
          </button>
          <button 
            onClick={() => setActiveTab('audio')}
            className={`px-10 py-3.5 rounded-[1.3rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === 'audio' ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xl scale-105' : 'text-slate-500 dark:text-gray-400 hover:text-blue-600'}`}
          >
            Podcasts
          </button>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
        {activeTab === 'audio' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {audios.map((audio) => (
              <CustomAudioPlayer key={audio.id} audio={audio} />
            ))}
            
            <div className="bg-slate-100 dark:bg-white/[0.03] border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-blue-500/40 transition-all">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-white/5 flex items-center justify-center text-gray-300 dark:text-gray-700 mb-4 group-hover:scale-110 group-hover:text-blue-500 transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              </div>
              <h5 className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest">Sugerir Conteúdo</h5>
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-2">Dê-nos a sua ideia</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* O conteúdo de vídeo já está bom, mas podes adicionar uma borda neon aqui também se quiseres */}
            {[
              { id: '1', title: "Emissão Especial WRF", youtubeId: "r5GzTRSWXgc", color: "from-blue-600 to-indigo-600" }, 
              { id: '2', title: "Destaque Musical", youtubeId: "kjRBK718BtM", color: "from-red-600 to-rose-600" }
            ].map((video) => (
              <div key={video.id} className={`group relative rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl transition-all hover:-translate-y-3 bg-gradient-to-br ${video.color} p-1`}>
                <div className="aspect-video w-full bg-black rounded-[2.8rem] overflow-hidden">
                  <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`} title={video.title} frameBorder="0" allowFullScreen></iframe>
                </div>
                <div className="p-8 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                     <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Conteúdo Original</p>
                  </div>
                  <h4 className="font-black text-xl tracking-tighter">{video.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaCenter;
