
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Player: React.FC = () => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [songTitle, setSongTitle] = useState(t.player.tuning);
  const [coverUrl, setCoverUrl] = useState("https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop");
  const [copied, setCopied] = useState(false);
  const songTitleRef = useRef(t.player.tuning);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamUrl = "https://rs2.ptservidor.com/proxy/orlando?mp=/stream";

  // Dispatch state whenever isPlaying changes
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('wrf-radio-state', { detail: { isPlaying } }));
  }, [isPlaying]);

  // Global listener for play/pause triggers from Header or Hero
  useEffect(() => {
    const handleToggle = () => {
      togglePlay();
    };
    window.addEventListener('wrf-toggle-play', handleToggle);
    return () => {
      window.removeEventListener('wrf-toggle-play', handleToggle);
    };
  }, [isPlaying]);

  // Função para procurar capa do álbum baseada no nome da música
  const fetchAlbumArt = async (title: string) => {
    if (!title || title.includes("Sintonizando") || title.toLowerCase().includes("web rádio")) return;
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(title)}&media=music&limit=1`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setCoverUrl(data.results[0].artworkUrl100.replace('100x100', '600x600'));
      }
    } catch {
      console.warn("Erro ao carregar capa do álbum");
    }
  };

  useEffect(() => {
    // Procurar o elemento proxy que o script do Centova atualiza
    const proxyId = 'cc_strinfo_song_orlando';
    let proxy = document.getElementById(proxyId);
    
    if (!proxy) {
      proxy = document.createElement('span');
      proxy.id = proxyId;
      proxy.className = 'cc_streaminfo';
      proxy.style.display = 'none';
      proxy.setAttribute('data-type', 'song');
      proxy.setAttribute('data-username', 'orlando');
      document.body.appendChild(proxy);
    }

    const updateSong = () => {
      if (!proxy) return;
      const newSong = (proxy.textContent || proxy.innerText || "").trim();
      
      const isPlaceholder = !newSong || 
                           newSong === "" || 
                           newSong.includes('cc_streaminfo') || 
                           newSong.toLowerCase() === 'loading...' || 
                           newSong.toLowerCase() === 'sintonizando...';

      if (!isPlaceholder && newSong !== songTitleRef.current) {
        songTitleRef.current = newSong;
        setSongTitle(newSong);
        fetchAlbumArt(newSong);
      }
    };

    const fetchFromApi = async () => {
      try {
        const response = await fetch('https://rs2.ptservidor.com:2199/rpc/orlando/streaminfo.get');
        const data = await response.json();
        if (data && data.data && data.data[0] && data.data[0].song) {
          const apiSong = data.data[0].song.trim();
          if (apiSong && apiSong !== songTitleRef.current && !apiSong.toLowerCase().includes('sintonizando')) {
            songTitleRef.current = apiSong;
            setSongTitle(apiSong);
            fetchAlbumArt(apiSong);
          }
        }
      } catch {
        // Fallback falhou, sem problemas
      }
    };

    const observer = new MutationObserver(updateSong);
    observer.observe(proxy, { childList: true, characterData: true, subtree: true });
    
    updateSong();
    fetchFromApi();

    const interval = setInterval(() => {
      updateSong();
      fetchFromApi();
    }, 15000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.src = `${streamUrl}&t=${Date.now()}`;
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => {
            console.error("Erro ao reproduzir áudio:", e);
            setIsPlaying(false);
          });
      }
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const copySong = () => {
    if (songTitle && songTitle !== t.player.tuning) {
      navigator.clipboard.writeText(songTitle);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:p-6 md:p-8 pointer-events-none">
      <div className="container mx-auto max-w-6xl w-full relative">
        
        {/* Atmospheric Glow Under Player */}
        <div className={`absolute inset-x-12 sm:inset-x-24 -bottom-2 h-14 transition-all duration-700 blur-[80px] pointer-events-none ${
          isPlaying ? 'bg-red-600/35' : 'bg-slate-800/10'
        }`}></div>
        
        <div className={`relative bg-[#0d101a]/95 dark:bg-[#07090e]/95 backdrop-blur-3xl rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-row items-center gap-3 sm:gap-6 md:gap-8 pointer-events-auto w-full transition-all duration-500 border border-white/10 ${
          isPlaying ? 'border-red-500/30 -translate-y-1' : ''
        }`}>
          
          {/* Vinyl Art & Track Details */}
          <div className="flex-grow min-w-0 flex items-center space-x-3 sm:space-x-5">
            
            {/* Vinyl Record */}
            <div className="relative h-14 w-14 sm:h-20 sm:w-20 md:h-24 md:w-24 flex-shrink-0">
               <div className={`absolute inset-0 rounded-full border-[5px] sm:border-[7px] border-black/90 overflow-hidden bg-black shadow-2xl transition-transform duration-[1.5s] ${
                 isPlaying ? 'animate-spin-slow' : 'scale-95 opacity-80'
               }`}>
                  <img 
                    key={coverUrl}
                    src={coverUrl} 
                    alt="Capa do Álbum" 
                    className="w-full h-full object-cover" 
                  />
                  {/* Concentric Grooves */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.5)_75%)] pointer-events-none"></div>
                  {/* Center Spindle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 bg-[#181818] rounded-full border border-white/20 z-10 shadow-inner flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                  </div>
               </div>
            </div>

            {/* Track Info */}
            <div className="flex flex-col min-w-0 flex-1">
              
              <div className="flex items-center space-x-2 sm:space-x-3 mb-1">
                {/* Live EQ Bars */}
                <div className="flex space-x-0.5 sm:space-x-1 h-3.5 items-end bg-black/40 px-2 py-0.5 rounded-full border border-white/5">
                  {[1, 2, 3, 4].map(i => (
                    <div 
                      key={i} 
                      className={`w-0.5 rounded-full bg-red-500 transition-all ${isPlaying ? 'animate-bounce' : 'h-1 opacity-20'}`} 
                      style={{ 
                        height: isPlaying ? `${35 + (i * 15) % 65}%` : '3px', 
                        animationDuration: `${0.4 + i * 0.15}s` 
                      }}
                    ></div>
                  ))}
                </div>
                
                <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] ${isPlaying ? 'text-red-500' : 'text-slate-500'}`}>
                  {isPlaying ? 'Em Direto • 320 kbps' : 'Standby • 24/7'}
                </span>
              </div>
              
              {/* Song Title */}
              <div className="flex items-center space-x-2">
                <h4 className="text-white font-brand font-black text-sm sm:text-xl md:text-2xl truncate tracking-tight leading-tight">
                  <span key={songTitle} className="truncate block">
                    {songTitle}
                  </span>
                </h4>

                {songTitle && songTitle !== t.player.tuning && (
                  <button
                    onClick={copySong}
                    title={copied ? "Copiado!" : "Copiar nome da música"}
                    className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-[10px]"
                  >
                    {copied ? (
                      <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    )}
                  </button>
                )}
              </div>

              {/* Station Subtext */}
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-slate-400 text-[9px] sm:text-xs font-bold uppercase tracking-wider truncate">
                  Web Rádio Figueiró
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-600 hidden sm:inline-block"></span>
                <span className="text-slate-400 text-[9px] sm:text-xs font-medium tracking-wider truncate hidden sm:inline-block">
                  Amarante • Tâmega
                </span>
              </div>
            </div>
          </div>
          
          {/* Controls: Volume, Stream Status & Play/Pause */}
          <div className="flex items-center space-x-2 sm:space-x-5 flex-shrink-0">
            
            {/* Desktop Volume Slider */}
            <div className="hidden md:flex items-center space-x-2 bg-white/[0.04] px-3 py-2 rounded-2xl border border-white/5">
              <button 
                onClick={toggleMute}
                className="text-slate-400 hover:text-white transition-colors"
                title={isMuted ? "Ativar som" : "Desativar som"}
              >
                {isMuted || volume === 0 ? (
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : volume < 0.5 ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
              />
            </div>

            {/* Tactile Play/Pause Button */}
            <button 
              onClick={togglePlay} 
              className={`relative h-12 w-12 sm:h-16 sm:w-16 md:h-18 md:w-18 flex-shrink-0 rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all duration-300 shadow-xl ${
                isPlaying 
                  ? 'bg-white text-slate-950 ring-4 ring-white/20' 
                  : 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-red-600/40 hover:scale-105 active:scale-95'
              }`}
              title={isPlaying ? "Pausar" : "Ouvir Rádio"}
            >
              {isPlaying ? (
                <svg className="w-6 h-6 sm:w-8 sm:h-8 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-6 h-6 sm:w-8 sm:h-8 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
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
          animation: spin-slow 18s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Player;

