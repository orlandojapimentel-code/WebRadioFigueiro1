
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Player: React.FC = () => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [songTitle, setSongTitle] = useState(t.player.tuning);
  const [coverUrl, setCoverUrl] = useState("https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop");
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamUrl = "https://rs2.ptservidor.com/proxy/orlando?mp=/stream";

  // Função para procurar capa do álbum baseada no nome da música
  const fetchAlbumArt = async (title: string) => {
    if (!title || title.includes("Sintonizando") || title.toLowerCase().includes("web rádio")) return;
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(title)}&media=music&limit=1`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setCoverUrl(data.results[0].artworkUrl100.replace('100x100', '600x600'));
      }
    } catch (err) {
      console.warn("Erro ao carregar capa do álbum");
    }
  };

  useEffect(() => {
    // Observar o elemento oculto preenchido pelo script externo centova
    const target = document.getElementById('cc_strinfo_song_orlando');
    if (!target) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const newSong = (mutation.target as HTMLElement).innerText;
        if (newSong && newSong !== songTitle) {
          setSongTitle(newSong);
          fetchAlbumArt(newSong);
        }
      });
    });

    observer.observe(target, { childList: true, characterData: true, subtree: true });
    
    // Fallback interval para garantir sincronização
    const interval = setInterval(() => {
      const current = target.innerText;
      if (current && current !== songTitle) {
        setSongTitle(current);
        fetchAlbumArt(current);
      }
    }, 5000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [songTitle]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Recarregar o stream para evitar delay de buffer
        audioRef.current.src = `${streamUrl}&t=${Date.now()}`;
        audioRef.current.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-8 md:p-12 pointer-events-none">
      <div className="container mx-auto max-w-7xl w-full relative">
        {/* Glow Effect */}
        <div className={`absolute inset-x-16 bottom-0 h-4 transition-all duration-1000 blur-[80px] ${isPlaying ? 'bg-red-600 opacity-40' : 'bg-slate-700 opacity-10'}`}></div>
        
        <div className={`relative bg-[#020617]/95 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[4rem] p-4 sm:p-6 md:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.95)] flex flex-row items-center gap-6 sm:gap-10 pointer-events-auto w-full transition-all duration-700 ${isPlaying ? 'ring-1 ring-red-500/30 -translate-y-2' : ''}`}>
          
          <div className="flex-grow min-w-0 flex items-center space-x-6 sm:space-x-10">
            {/* Disco Animado */}
            <div className="relative h-20 w-20 sm:h-28 sm:w-28 md:h-36 md:w-36 flex-shrink-0">
               <div className={`absolute inset-0 rounded-full border-[6px] sm:border-[10px] border-white/5 overflow-hidden bg-black shadow-2xl transition-transform duration-[2s] ${isPlaying ? 'animate-spin-slow' : 'scale-95 opacity-80'}`}>
                  <img 
                    src={coverUrl} 
                    alt="Cover" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-8 sm:h-8 bg-slate-900 rounded-full border border-white/10 z-10 shadow-inner"></div>
               </div>
               {/* Agulha ou detalhe decorativo */}
               <div className={`absolute -top-2 -right-2 h-10 w-10 transition-all duration-500 ${isPlaying ? 'rotate-0 opacity-100' : 'rotate-12 opacity-0'}`}>
                  <svg className="w-full h-full text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z"/></svg>
               </div>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full border transition-all ${isPlaying ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-slate-700 bg-slate-800 text-slate-500'}`}>
                  {isPlaying ? t.player.live : 'OFF AIR'}
                </span>
                {isPlaying && (
                  <div className="flex space-x-1 h-3 items-end">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-0.5 bg-red-500 animate-bounce" style={{ height: `${30 + Math.random() * 70}%`, animationDuration: `${0.6 + i*0.1}s` }}></div>
                    ))}
                  </div>
                )}
              </div>
              
              <h4 className="text-white font-brand font-black text-xl sm:text-3xl md:text-4xl truncate tracking-tighter leading-none mb-1 sm:mb-2">
                <span id="cc_strinfo_song_orlando" className="cc_streaminfo" data-type="song" data-username="orlando">
                  {songTitle}
                </span>
              </h4>
              <p className="text-slate-400 text-[10px] sm:text-sm font-bold uppercase tracking-[0.3em] truncate opacity-60">
                Web Rádio Figueiró • Amarante
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-10 flex-shrink-0">
            <button 
              onClick={togglePlay} 
              className={`relative h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 aspect-square flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-500 ${isPlaying ? 'bg-white text-black scale-105 shadow-[0_0_60px_rgba(255,255,255,0.3)]' : 'bg-red-600 text-white shadow-[0_15px_40px_rgba(220,38,38,0.4)]'} hover:scale-110 active:scale-95 group overflow-hidden`}
            >
              {isPlaying ? (
                <svg className="w-8 h-8 sm:w-14 sm:h-14" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-8 h-8 sm:w-14 sm:h-14 ml-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={streamUrl} preload="none" />
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Player;
