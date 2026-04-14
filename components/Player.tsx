
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Player: React.FC = () => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [songTitle, setSongTitle] = useState(t.player.tuning);
  const [coverUrl, setCoverUrl] = useState("https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop");
  const songTitleRef = useRef(t.player.tuning);
  
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
      
      // Filtros para evitar placeholders do Centova ou estados de carregamento
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
    
    // Tenta atualizar imediatamente
    updateSong();
    fetchFromApi();

    const interval = setInterval(() => {
      updateSong();
      fetchFromApi();
    }, 15000); // A cada 15 segundos para não sobrecarregar

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []); // Executa apenas uma vez ao montar

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
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-8 md:p-10 pointer-events-none">
      <div className="container mx-auto max-w-6xl w-full relative">
        {/* Glow Effect */}
        <div className={`absolute inset-x-20 bottom-0 h-8 transition-all duration-1000 blur-[100px] ${isPlaying ? 'bg-red-600/40' : 'bg-slate-700/10'}`}></div>
        
        <div className={`relative premium-glass rounded-[2.5rem] sm:rounded-[3.5rem] p-4 sm:p-6 shadow-2xl flex flex-row items-center gap-4 sm:gap-10 pointer-events-auto w-full transition-all duration-700 ${isPlaying ? 'border-red-500/30 -translate-y-2' : ''}`}>
          
          <div className="flex-grow min-w-0 flex items-center space-x-4 sm:space-x-10">
            {/* Disco Animado - Hi-Fi Style */}
            <div className="relative h-16 w-16 sm:h-28 sm:w-28 md:h-32 md:w-32 flex-shrink-0">
               <div className={`absolute inset-0 rounded-full border-[8px] border-black/80 overflow-hidden bg-black shadow-2xl transition-transform duration-[2s] ${isPlaying ? 'animate-spin-slow' : 'scale-95 opacity-80'}`}>
                  <img 
                    key={coverUrl}
                    src={coverUrl} 
                    alt="Cover" 
                    className="w-full h-full object-cover opacity-80" 
                  />
                  {/* Vinyl Texture Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)_70%)] pointer-events-none"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-8 sm:h-8 bg-[#1a1a1a] rounded-full border border-white/10 z-10 shadow-inner flex items-center justify-center">
                    <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex space-x-1 h-4 items-end bg-black/40 px-3 py-1 rounded-full border border-white/5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-0.5 bg-red-500 ${isPlaying ? 'animate-bounce' : 'h-1 opacity-20'}`} style={{ height: isPlaying ? `${40 + Math.random() * 60}%` : '4px', animationDuration: `${0.5 + i*0.1}s` }}></div>
                  ))}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${isPlaying ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
                  {isPlaying ? 'Live Stream 320kbps' : 'Standby'}
                </span>
              </div>
              
              <h4 className="text-white font-brand font-black text-lg sm:text-3xl md:text-4xl truncate tracking-tighter leading-tight mb-1 text-glow">
                <span key={songTitle} className="animate-in fade-in slide-in-from-bottom-2 duration-700 block">
                  {songTitle}
                </span>
              </h4>
              <div className="flex items-center space-x-3">
                <p className="text-slate-500 text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] truncate">
                  Web Rádio Figueiró
                </p>
                <div className="h-1 w-1 rounded-full bg-slate-700"></div>
                <p className="text-slate-500 text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] truncate">
                  Amarante, PT
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 sm:space-x-8 flex-shrink-0">
            {/* VU Meter Visualizer (Fake) */}
            <div className="hidden lg:flex flex-col space-y-1 w-24">
              {[1,2,3].map(i => (
                <div key={i} className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div className={`h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-300 ${isPlaying ? '' : 'w-0'}`} style={{ width: isPlaying ? `${60 + Math.random() * 40}%` : '0%' }}></div>
                </div>
              ))}
            </div>

            <button 
              onClick={togglePlay} 
              className={`relative h-16 w-16 sm:h-24 sm:w-24 md:h-28 md:w-28 flex-shrink-0 rounded-3xl flex items-center justify-center transition-all duration-500 ${isPlaying ? 'bg-white text-black shadow-[0_0_50px_rgba(255,255,255,0.2)]' : 'bg-red-600 text-white shadow-lg'} hover:scale-105 active:scale-95 group overflow-hidden border border-white/10`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {isPlaying ? (
                <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-8 h-8 sm:w-12 sm:h-12 ml-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
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
