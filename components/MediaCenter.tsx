
import React, { useState, useRef, useEffect } from 'react';
import SpecialPlaylist from './SpecialPlaylist';

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
    <div className="glass-card glass-card-interactive relative overflow-hidden group p-6 transition-all duration-300">
      <audio 
        ref={audioRef} 
        src={audio.audioUrl} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="relative z-10 flex items-center space-x-4 sm:space-x-5">
        {/* Play Button */}
        <button 
          onClick={togglePlay}
          className={`h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
            isPlaying 
            ? 'bg-red-600 text-white shadow-red-600/40 ring-4 ring-red-500/20' 
            : 'bg-white/10 hover:bg-red-600 text-white'
          }`}
        >
          {isPlaying ? (
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-6 h-6 sm:w-7 sm:h-7 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-red-400 px-2.5 py-0.5 rounded-full">
              {audio.category}
            </span>
            {isPlaying && (
              <div className="flex space-x-1 h-3 items-end">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-0.5 bg-red-500 animate-bounce" style={{ height: `${30 + Math.random() * 70}%`, animationDuration: `${0.4 + Math.random() * 0.4}s` }}></div>
                ))}
              </div>
            )}
          </div>
          <h4 className="text-white font-brand font-bold text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">
            {audio.title}
          </h4>
        </div>
      </div>

      <div className="mt-5 flex flex-col space-y-2 relative z-10">
        <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
           <span className={isPlaying ? 'text-red-400 font-black animate-pulse' : ''}>{isPlaying ? 'A Reproduzir' : 'Pronto'}</span>
           <span>{audio.duration}</span>
        </div>
      </div>
    </div>
  );
};

const MediaCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'playlist' | 'audio' | 'video' | 'myMusic'>('playlist');

  useEffect(() => {
    const handleSetTab = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab?: string }>;
      if (customEvent.detail?.tab && ['playlist', 'audio', 'video', 'myMusic'].includes(customEvent.detail.tab)) {
        setActiveTab(customEvent.detail.tab as 'playlist' | 'audio' | 'video' | 'myMusic');
      }
    };
    window.addEventListener('wrf-set-media-tab', handleSetTab);
    return () => {
      window.removeEventListener('wrf-set-media-tab', handleSetTab);
    };
  }, []);

  const myMusicVideos = [
    { id: 'm1', title: "Minha Música #1", youtubeId: "AvHMFxjPSuM", color: "from-purple-600 to-indigo-600" },
    { id: 'm2', title: "Minha Música #2", youtubeId: "x91uzSqtJlw", color: "from-blue-600 to-cyan-600" },
    { id: 'm3', title: "Minha Música #3", youtubeId: "TsjKIeLXcmA", color: "from-amber-600 to-orange-600" },
    { id: 'm4', title: "Minha Música #4", youtubeId: "0B3ivU16tNE", color: "from-emerald-600 to-teal-600" },
    { id: 'm5', title: "Minha Música #5", youtubeId: "-u6MT203gx0", color: "from-pink-600 to-rose-600" },
    { id: 'm6', title: "Minha Música #6", youtubeId: "82F8kJ1sGAY", color: "from-indigo-600 to-blue-600" },
  ];

  const audios: AudioItem[] = [
    { 
      id: '1', 
      title: "Entrevista: Ás da Concertina e Vasquinho da Concertina", 
      category: "Tradição Viva", 
      audioUrl: "https://www.dropbox.com/scl/fi/u3r7msk0h6blqpjt8mrba/Entrevista-s-da-concertina-e-Vasquinho-24-01-2025.mp3?rlkey=2sb2suromeylsn0yiwoyc67mn&st=qhx3c6fq&raw=1",
      duration: "1h 21min",
      colorClass: "",
      accentColor: ""
    },
    { 
      id: '2', 
      title: "Prazeres Interrompidos - Promo", 
      category: "Podcast Literário", 
      audioUrl: "https://www.dropbox.com/scl/fi/tz8ccze2co79c16pwq1jp/PROMO-Web-R-dio-Figueir.mp3?rlkey=88lpwhzqnl845jn86g4b4b7ai&st=try9kss2&raw=1",
      duration: "0:30 seg",
      colorClass: "",
      accentColor: ""
    },
  ];

  return (
    <div id="multimedia" className="space-y-8 scroll-mt-28">
      <div id="playlist-section" className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-red-600/10 border border-red-500/20 rounded-2xl text-red-500 shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span className="text-[9px] text-red-500 font-black uppercase tracking-[0.25em] block">Multimédia & Música</span>
            <h3 className="text-2xl sm:text-3xl font-brand font-black text-white tracking-tight">Explorar Conteúdos</h3>
            <p className="text-xs text-slate-400 mt-1">Playlist de autor, podcasts, emissões e destaques</p>
          </div>
        </div>

        <div className="flex bg-white/[0.04] p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar max-w-full gap-1">
          <button 
            onClick={() => setActiveTab('playlist')}
            className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
              activeTab === 'playlist' 
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-500/20' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span>Playlist (15 Músicas)</span>
          </button>

          <button 
            onClick={() => setActiveTab('audio')}
            className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
              activeTab === 'audio' 
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Podcasts</span>
          </button>

          <button 
            onClick={() => setActiveTab('video')}
            className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
              activeTab === 'video' 
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Vídeos</span>
          </button>

          <button 
            onClick={() => setActiveTab('myMusic')}
            className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
              activeTab === 'myMusic' 
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Vídeos Musicais</span>
          </button>
        </div>
      </div>

      <div className="animate-in fade-in duration-300">
        {activeTab === 'playlist' && (
          <SpecialPlaylist />
        )}

        {activeTab === 'audio' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {audios.map((audio) => (
              <CustomAudioPlayer key={audio.id} audio={audio} />
            ))}
            
            <div className="glass-card border-dashed border-white/20 p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-red-500/40 transition-all min-h-[160px]">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 mb-3 group-hover:scale-110 group-hover:text-red-500 transition-all border border-white/10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              </div>
              <h5 className="text-white font-brand font-bold text-sm tracking-tight">Sugerir Conteúdo</h5>
              <p className="text-slate-400 text-xs mt-1">Envie-nos a sua sugestão ou tema para debate</p>
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: '1', title: "Emissão Especial WRF", youtubeId: "r5GzTRSWXgc" }, 
              { id: '2', title: "Destaque Musical", youtubeId: "kjRBK718BtM" }
            ].map((video) => (
              <div key={video.id} className="glass-card glass-card-interactive overflow-hidden group">
                <div className="aspect-video w-full bg-black overflow-hidden">
                  <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`} title={video.title} frameBorder="0" allowFullScreen></iframe>
                </div>
                <div className="p-5">
                  <div className="flex items-center space-x-2 mb-1.5">
                     <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                     <p className="text-[9px] font-black uppercase tracking-widest text-red-400">Conteúdo Original</p>
                  </div>
                  <h4 className="font-brand font-bold text-base sm:text-lg text-white tracking-tight">{video.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'myMusic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myMusicVideos.map((video) => (
              <div key={video.id} className="glass-card glass-card-interactive overflow-hidden group">
                <div className="aspect-video w-full bg-black overflow-hidden">
                  <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`} title={video.title} frameBorder="0" allowFullScreen></iframe>
                </div>
                <div className="p-4">
                  <h4 className="font-brand font-bold text-sm text-white tracking-tight truncate">{video.title}</h4>
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
