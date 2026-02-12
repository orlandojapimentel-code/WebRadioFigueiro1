
import React, { useState, useEffect, useRef } from 'react';

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  
  const STUDIO_IMAGE = "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop"; 
  const MIXER_LIVE_IMAGE = "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800&auto=format&fit=crop"; 
  const MUSIC_VINYL_IMAGE = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop"; 
  
  const [coverUrl, setCoverUrl] = useState(STUDIO_IMAGE);
  const [currentSong, setCurrentSong] = useState("Sintonizando...");
  const [isLive, setIsLive] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamUrl = "https://rs2.ptservidor.com/proxy/orlando?mp=/stream?type=.mp3";

  const fetchAlbumArt = async (rawSongName: string) => {
    const text = rawSongName.toLowerCase();
    const hasLivePrefix = text.startsWith("direto") || text.startsWith("live") || text.startsWith("emissão");
    
    if (hasLivePrefix) {
      setIsLive(true);
      setCoverUrl(MIXER_LIVE_IMAGE);
      return;
    }

    setIsLive(false);

    if (!rawSongName || text.includes("sintonizando") || text === "web rádio figueiró") {
      setCoverUrl(STUDIO_IMAGE);
      return;
    }

    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(rawSongName)}&media=music&limit=1`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setCoverUrl(data.results[0].artworkUrl100.replace('100x100', '600x600'));
      } else {
        setCoverUrl(MUSIC_VINYL_IMAGE);
      }
    } catch {
      setCoverUrl(MUSIC_VINYL_IMAGE);
    }
  };

  useEffect(() => {
    const target = document.getElementById('cc_strinfo_song_orlando');
    if (!target) return;

    const handleSongChange = (newSong: string) => {
      const trimmed = newSong.trim();
      if (trimmed && trimmed !== currentSong) {
        setCurrentSong(trimmed);
        fetchAlbumArt(trimmed);
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => handleSongChange((mutation.target as HTMLElement).innerText));
    });

    observer.observe(target, { childList: true, characterData: true, subtree: true });
    
    const syncInterval = setInterval(() => {
      if (target.innerText && target.innerText.trim() !== currentSong) {
        handleSongChange(target.innerText);
      }
    }, 5000);

    return () => { observer.disconnect(); clearInterval(syncInterval); };
  }, [currentSong]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.src = `${streamUrl}&t=${Date.now()}`;
        audioRef.current.play().catch(e => console.error(e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-8 pointer-events-none">
      <div className="container mx-auto max-w-5xl relative">
        
        {/* Glow de base constante para separar do fundo preto */}
        <div className={`absolute inset-x-8 bottom-0 h-1 transition-all duration-1000 blur-xl ${isPlaying ? 'bg-blue-500' : 'bg-slate-700'} opacity-50`}></div>

        <div className={`relative bg-slate-900/90 border border-white/20 backdrop-blur-2xl rounded-[3rem] p-4 md:p-6 shadow-[0_40px_100px_rgba(0,0,0,0.9)] flex flex-row items-center gap-6 md:gap-10 transition-all duration-500 pointer-events-auto ${isPlaying ? 'ring-2 ring-blue-500/30 -translate-y-2' : ''}`}>
          
          <div className="flex items-center space-x-6 md:space-x-8 flex-grow min-w-0">
            {/* DISCO ANIMADO */}
            <div className={`relative h-16 w-16 md:h-24 md:w-24 shrink-0 transition-all duration-1000 ${isPlaying ? 'scale-110' : 'scale-95 opacity-60'}`}>
               <div className={`absolute inset-0 rounded-full border-4 border-white/10 overflow-hidden bg-black shadow-2xl ${isPlaying ? 'animate-spin-slow' : ''}`}>
                 <img src={coverUrl} alt="Capa" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/20"></div>
                 {/* Centro do disco */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 rounded-full border-2 border-white/20 shadow-inner"></div>
               </div>
            </div>

            <div className="flex flex-col min-w-0 flex-grow">
              <div className="flex items-center space-x-3 mb-2">
                <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full border ${isLive ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-blue-500 bg-blue-500/10 text-blue-400'}`}>
                  {isLive ? 'Em Direto' : 'Emissão Digital'}
                </span>
                <span className="hidden sm:inline-flex items-center space-x-1">
                   <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">320kbps HD Audio</span>
                </span>
              </div>
              <h3 className="text-white text-base md:text-2xl font-brand font-black tracking-tighter truncate leading-none">
                <span id="cc_strinfo_song_orlando" className="cc_streaminfo" data-type="song" data-username="orlando">Sintonizando...</span>
              </h3>
              <p className="text-slate-400 text-[10px] font-medium mt-1 uppercase tracking-widest hidden md:block">Web Rádio Figueiró • Amarante</p>
            </div>
          </div>

          {/* BOTÃO DE PLAY ELETRONICO */}
          <div className="flex items-center space-x-6">
            <div className="hidden lg:flex flex-col items-end space-y-2 px-4">
              <div className="flex space-x-1 h-4 items-center">
                 {[...Array(8)].map((_, i) => (
                   <div key={i} className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-blue-500 animate-bounce' : 'bg-slate-700 h-1'}`} 
                        style={{ animationDelay: `${i * 0.1}s`, height: isPlaying ? `${Math.random() * 100}%` : '4px' }}></div>
                 ))}
              </div>
            </div>

            <button 
              onClick={togglePlay}
              className={`relative h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center transition-all duration-500 ${isPlaying ? 'bg-white text-black scale-105 shadow-[0_0_30px_rgba(255,255,255,0.4)]' : 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'} hover:scale-110 active:scale-90 group`}
            >
              <div className={`absolute inset-0 rounded-full border-4 border-current opacity-20 ${isPlaying ? 'animate-ping' : ''}`}></div>
              {isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-8 h-8 ml-1 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <audio ref={audioRef} preload="none" />
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
};

export default Player;
