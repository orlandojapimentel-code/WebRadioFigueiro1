
import React, { useState, useEffect, useRef } from 'react';

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
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
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-10 pointer-events-none">
      <div className="container mx-auto max-w-5xl relative">
        
        {/* Glow de base sutil e refinado */}
        <div className={`absolute inset-x-12 bottom-0 h-1.5 transition-all duration-1000 blur-2xl ${isPlaying ? 'bg-blue-500 opacity-40' : 'bg-slate-700 opacity-20'}`}></div>

        <div className={`relative bg-slate-900/95 border border-white/10 backdrop-blur-3xl rounded-[3.5rem] p-5 md:p-7 shadow-[0_50px_120px_rgba(0,0,0,0.9)] flex flex-row items-center gap-8 md:gap-12 transition-all duration-700 pointer-events-auto ${isPlaying ? 'ring-1 ring-blue-500/20 -translate-y-2' : ''}`}>
          
          <div className="flex items-center space-x-6 md:space-x-10 flex-grow min-w-0">
            {/* DISCO ESTILO STUDIO */}
            <div className={`relative h-20 w-20 md:h-28 md:w-28 shrink-0 transition-all duration-1000 ${isPlaying ? 'scale-110 rotate-3' : 'scale-100'}`}>
               <div className={`absolute inset-0 rounded-full border-[6px] border-white/5 overflow-hidden bg-black shadow-2xl ${isPlaying ? 'animate-spin-slow' : ''}`}>
                 <img src={coverUrl} alt="Capa Album" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-white/10"></div>
                 {/* Centro do disco */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-slate-900 rounded-full border-2 border-white/10 shadow-inner"></div>
               </div>
               {/* Reflexo de luz dinâmico no disco */}
               <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
            </div>

            <div className="flex flex-col min-w-0 flex-grow">
              <div className="flex items-center space-x-3 mb-3">
                <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border ${isLive ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-blue-500 bg-blue-500/10 text-blue-400'}`}>
                  {isLive ? 'Em Direto' : 'WRF Digital'}
                </span>
                <span className="hidden sm:inline-flex items-center space-x-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                   <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></span>
                   <span>HD Audio 320kbps</span>
                </span>
              </div>
              <h3 className="text-white text-xl md:text-3xl font-brand font-black tracking-tighter truncate leading-tight">
                <span id="cc_strinfo_song_orlando" className="cc_streaminfo" data-type="song" data-username="orlando">Sintonizando...</span>
              </h3>
              <p className="text-slate-400 text-xs font-medium mt-2 uppercase tracking-[0.3em] hidden md:block">Web Rádio Figueiró • Amarante</p>
            </div>
          </div>

          {/* CONTROLOS DO PLAYER */}
          <div className="flex items-center space-x-8">
            <div className="hidden lg:flex flex-col items-end space-y-3 px-4">
              <div className="flex space-x-1.5 h-6 items-center">
                 {[...Array(12)].map((_, i) => (
                   <div key={i} className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-blue-500 animate-bounce' : 'bg-slate-800 h-1.5'}`} 
                        style={{ animationDelay: `${i * 0.08}s`, height: isPlaying ? `${40 + Math.random() * 60}%` : '6px' }}></div>
                 ))}
              </div>
            </div>

            <button 
              onClick={togglePlay}
              className={`relative h-20 w-20 md:h-24 md:w-24 rounded-full flex items-center justify-center transition-all duration-500 ${isPlaying ? 'bg-white text-black scale-105 shadow-[0_0_50px_rgba(255,255,255,0.3)]' : 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]'} hover:scale-110 active:scale-95 group overflow-hidden`}
            >
              <div className={`absolute inset-0 rounded-full border-4 border-current opacity-20 ${isPlaying ? 'animate-ping' : ''}`}></div>
              {isPlaying ? (
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-10 h-10 ml-1.5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <audio ref={audioRef} preload="none" />
    </div>
  );
};

export default Player;
