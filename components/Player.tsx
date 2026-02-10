
import React, { useState, useEffect, useRef } from 'react';

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [previousVolume, setPreviousVolume] = useState(0.8);
  
  // Imagens Temáticas de Alta Qualidade para Fallback
  const STUDIO_IMAGE = "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop"; 
  const MIXER_LIVE_IMAGE = "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800&auto=format&fit=crop"; 
  const MUSIC_VINYL_IMAGE = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop"; 
  
  const [coverUrl, setCoverUrl] = useState(STUDIO_IMAGE);
  const [currentSong, setCurrentSong] = useState("Sintonizando...");
  const [isLive, setIsLive] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamUrl = "https://rs2.ptservidor.com/proxy/orlando?mp=/stream?type=.mp3";

  /**
   * Limpa o nome da música para pesquisa no iTunes
   */
  const cleanSongNameForSearch = (name: string) => {
    return name
      .replace(/^DIRETO\s*-\s*/gi, '')
      .replace(/^LIVE\s*-\s*/gi, '')
      .replace(/^EMISSÃO\s*-\s*/gi, '')
      .replace(/^EMISSAO\s*-\s*/gi, '')
      .replace(/^LOCUTOR\s*-\s*/gi, '')
      .replace(/WEB RÁDIO FIGUEIRÓ/gi, '')
      .replace(/WEB RADIO FIGUEIRO/gi, '')
      .trim();
  };

  const fetchAlbumArt = async (rawSongName: string) => {
    const text = rawSongName.toLowerCase();
    
    // 1. Deteção de modo DIRETO / EMISSÃO
    const hasLivePrefix = text.startsWith("direto") || text.startsWith("live") || text.startsWith("emissão") || text.startsWith("emissao");
    const isHost = text.includes("orlando pimentel") || text.includes("radialista");
    
    if (hasLivePrefix || isHost) {
      setIsLive(true);
      setCoverUrl(MIXER_LIVE_IMAGE);
      return;
    }

    setIsLive(false);

    // 2. Se for texto genérico de sintonização ou apenas o nome da rádio
    if (!rawSongName || text.includes("sintonizando") || text === "web rádio figueiró") {
      setCoverUrl(STUDIO_IMAGE);
      return;
    }

    // 3. Tenta pesquisar a capa da MÚSICA
    const songSearchTerm = cleanSongNameForSearch(rawSongName);
    if (songSearchTerm.length < 3) {
      setCoverUrl(MUSIC_VINYL_IMAGE);
      return;
    }
    
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(songSearchTerm)}&media=music&entity=song&limit=1`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Upgrade para 600x600 para alta definição no disco
        const highResCover = data.results[0].artworkUrl100.replace('100x100', '600x600');
        setCoverUrl(highResCover);
      } else {
        // Se não houver resultado no iTunes, usa o Vinil Artístico
        setCoverUrl(MUSIC_VINYL_IMAGE);
      }
    } catch (error) {
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

    // Observa mudanças dinâmicas no DOM (Centova Cast)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const text = (mutation.target as HTMLElement).innerText;
        handleSongChange(text);
      });
    });

    observer.observe(target, { childList: true, characterData: true, subtree: true });
    
    // Backup: Verifica manualmente a cada 5 segundos para garantir sincronismo
    const syncInterval = setInterval(() => {
      if (target.innerText && target.innerText.trim() !== currentSong) {
        handleSongChange(target.innerText);
      }
    }, 5000);

    // Verificação inicial
    if (target.innerText) handleSongChange(target.innerText);

    return () => {
      observer.disconnect();
      clearInterval(syncInterval);
    };
  }, [currentSong]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const buster = `&t=${Date.now()}`;
        audioRef.current.src = `${streamUrl}${buster}`;
        audioRef.current.play().catch(e => console.error(e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPreviousVolume(volume);
      setVolume(0);
    } else {
      setVolume(previousVolume || 0.8);
    }
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const bars = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    delay: `${i * 0.05}s`,
    duration: `${0.4 + Math.random() * 0.6}s`
  }));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-3 md:p-8 pointer-events-none">
      <div className="container mx-auto max-w-5xl relative">
        
        {/* Glow de Atividade */}
        {isPlaying && (
          <div className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-blue-600/20 blur-[100px] -z-10 animate-pulse"></div>
        )}

        <div className={`relative bg-slate-900/95 dark:bg-black/98 border border-white/10 backdrop-blur-3xl rounded-3xl md:rounded-[2.5rem] p-3 md:p-5 shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-row items-center gap-3 md:gap-6 transition-all duration-500 pointer-events-auto ${isPlaying ? 'ring-1 md:ring-2 ring-blue-500/40 -translate-y-1 md:-translate-y-2' : ''}`}>
          
          <div className="flex items-center space-x-3 md:space-x-6 flex-grow min-w-0">
            {/* DISCO DE VINIL DINÂMICO */}
            <div className={`relative h-14 w-14 md:h-24 md:w-24 shrink-0 transition-all duration-1000 ${isPlaying ? 'scale-100' : 'scale-90 opacity-80'}`}>
               <div className={`absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur opacity-20 ${isPlaying ? 'animate-pulse' : 'hidden'}`}></div>
               <div className={`relative w-full h-full rounded-full border-4 border-black/40 overflow-hidden bg-gray-900 shadow-2xl transition-all duration-1000 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                 <img 
                    src={coverUrl} 
                    alt="Capa" 
                    key={coverUrl}
                    className="w-full h-full object-cover animate-in fade-in duration-700"
                    onError={() => setCoverUrl(MUSIC_VINYL_IMAGE)}
                 />
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.3)_100%)]"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 md:w-5 h-3 md:h-5 bg-black rounded-full border-2 border-white/10 shadow-inner z-10"></div>
               </div>
            </div>

            <div className="flex flex-col min-w-0 flex-grow">
              <div className="flex items-center space-x-2 mb-1">
                <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-md border transition-colors ${isPlaying ? (isLive ? 'bg-red-600/10 border-red-500/30' : 'bg-blue-600/10 border-blue-500/30') : 'bg-white/5 border-white/5'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-current animate-pulse' : 'bg-gray-600'} ${isLive ? 'text-red-500' : 'text-blue-500'}`}></span>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${isPlaying ? (isLive ? 'text-red-500' : 'text-blue-500') : 'text-gray-500'}`}>
                    {isLive ? 'Direto' : 'Emissão'}
                  </span>
                </div>
                <span className="hidden sm:inline text-white/20 text-[10px]">•</span>
                <span className="hidden sm:inline text-[8px] font-black text-white/40 uppercase tracking-widest">Digital HD</span>
              </div>
              
              <div className="overflow-hidden">
                <h3 className="text-white text-sm md:text-xl font-brand font-[900] tracking-tighter truncate leading-tight">
                  <span id="cc_strinfo_song_orlando" className="cc_streaminfo" data-type="song" data-username="orlando">Sintonizando...</span>
                </h3>
              </div>

              {/* Visualizador de Áudio Animado */}
              <div className="hidden md:flex items-end space-x-[2px] h-6 opacity-60 mt-2">
                {bars.map((bar) => (
                  <div
                    key={bar.id}
                    className={`flex-grow max-w-[4px] rounded-full origin-bottom transition-all duration-300 ${isLive ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ 
                      animation: isPlaying ? `wave ${bar.duration} ease-in-out infinite` : 'none',
                      animationDelay: bar.delay,
                      height: isPlaying ? '100%' : '15%'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CONTROLOS */}
          <div className="flex items-center space-x-3 md:space-x-6 shrink-0">
            <div className="hidden lg:flex items-center space-x-4 bg-white/5 p-4 rounded-3xl border border-white/5 min-w-[150px]">
              <button onClick={toggleMute} className="text-white/40 hover:text-white transition-colors">
                {volume === 0 ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                )}
              </button>
              <div className="relative flex-grow h-1 bg-white/10 rounded-full overflow-hidden">
                <input 
                  type="range" min="0" max="1" step="0.01" value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className={`h-full rounded-full transition-all ${isLive ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${volume * 100}%` }} />
              </div>
            </div>

            <button 
              onClick={togglePlay}
              className={`relative h-14 w-14 md:h-24 md:w-24 rounded-full flex items-center justify-center transition-all duration-500 ${isPlaying ? 'bg-white text-black' : 'bg-blue-600 text-white shadow-xl'} hover:scale-105 active:scale-95 group`}
            >
              {isPlaying ? (
                <svg className="w-6 h-6 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-6 h-6 md:w-10 md:h-10 ml-1 md:ml-2 group-hover:translate-x-0.5 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <audio ref={audioRef} preload="none" />
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        @keyframes wave {
          0%, 100% { height: 15%; }
          50% { height: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Player;
