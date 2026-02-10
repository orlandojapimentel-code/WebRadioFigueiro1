
import React, { useState, useEffect, useRef } from 'react';

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [previousVolume, setPreviousVolume] = useState(0.8);
  
  // Imagens Temáticas de Alta Qualidade (Unsplash)
  const DEFAULT_RADIO_IMAGE = "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop"; // Estúdio Geral
  const LIVE_EMISSION_IMAGE = "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=800&auto=format&fit=crop"; // Mesa de Mistura (Live)
  const HOST_ORLANDO_IMAGE = "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop"; // Radialista / Host
  const LOGO_FALLBACK = "logo.png"; // Logo local
  
  const [coverUrl, setCoverUrl] = useState(DEFAULT_RADIO_IMAGE);
  const [currentSong, setCurrentSong] = useState("Sintonizando...");
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamUrl = "https://rs2.ptservidor.com/proxy/orlando?mp=/stream?type=.mp3";

  // Lógica Inteligente de Fallback baseada no texto da emissão
  const getFallbackImage = (songName: string): string => {
    const text = songName.toLowerCase();
    
    // 1. Se for Direto/Emissão, prioridade à imagem da mesa de som (Mixer)
    if (text.includes("direto") || text.includes("live") || text.includes("emissao") || text.includes("emissão")) {
      return LIVE_EMISSION_IMAGE;
    }
    
    // 2. Se for o locutor Orlando Pimentel especificamente (e não disser "Direto")
    if (text.includes("orlando pimentel")) {
      return HOST_ORLANDO_IMAGE;
    }
    
    // 3. Padrão: Estúdio profissional
    return DEFAULT_RADIO_IMAGE;
  };

  const fetchAlbumArt = async (songName: string) => {
    // Se for texto genérico da rádio, usa logo o fallback temático
    if (!songName || songName.trim() === "" || songName.includes("Sintonizando") || songName.toLowerCase().includes("web rádio figueiró")) {
      setCoverUrl(DEFAULT_RADIO_IMAGE);
      return;
    }
    
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(songName)}&media=music&limit=1`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Upgrade para 600x600 para garantir nitidez no disco
        const highResCover = data.results[0].artworkUrl100.replace('100x100', '600x600');
        setCoverUrl(highResCover);
      } else {
        setCoverUrl(getFallbackImage(songName));
      }
    } catch (error) {
      setCoverUrl(getFallbackImage(songName));
    }
  };

  // Monitoriza o elemento de texto do Centova Cast para atualizar a capa
  useEffect(() => {
    const target = document.getElementById('cc_strinfo_song_orlando');
    if (!target) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const newSong = (mutation.target as HTMLElement).innerText;
        if (newSong && newSong !== currentSong) {
          setCurrentSong(newSong);
          fetchAlbumArt(newSong);
        }
      });
    });

    observer.observe(target, { childList: true, characterData: true, subtree: true });
    
    // Chamada inicial para caso o texto já lá esteja
    if (target.innerText && target.innerText !== "Sintonizando...") {
      setCurrentSong(target.innerText);
      fetchAlbumArt(target.innerText);
    }

    return () => observer.disconnect();
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

  const bars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: `${i * 0.05}s`,
    duration: `${0.4 + Math.random() * 0.6}s`
  }));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-3 md:p-8 pointer-events-none">
      <div className="container mx-auto max-w-5xl relative">
        
        {/* Efeito de brilho quando a rádio toca */}
        {isPlaying && (
          <div className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-blue-600/20 blur-[100px] -z-10 animate-pulse"></div>
        )}

        <div className={`relative bg-slate-900/95 dark:bg-black/98 border border-white/10 backdrop-blur-3xl rounded-3xl md:rounded-[2.5rem] p-3 md:p-5 shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-row items-center gap-3 md:gap-6 transition-all duration-500 pointer-events-auto ${isPlaying ? 'ring-1 md:ring-2 ring-blue-500/40 -translate-y-1 md:-translate-y-2' : ''}`}>
          
          {/* SECÇÃO INFO E DISCO GIRATÓRIO */}
          <div className="flex items-center space-x-3 md:space-x-6 flex-grow min-w-0">
            {/* Disco de Vinil com Imagem Dinâmica */}
            <div className={`relative h-14 w-14 md:h-24 md:w-24 shrink-0 transition-all duration-1000 ${isPlaying ? 'scale-100' : 'scale-90 opacity-80'}`}>
               <div className={`absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur opacity-20 ${isPlaying ? 'animate-pulse' : 'hidden'}`}></div>
               <div className={`relative w-full h-full rounded-full border-4 border-black/40 overflow-hidden bg-gray-900 shadow-2xl transition-all duration-1000 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                 <img 
                    src={coverUrl} 
                    alt="Emissão Web Rádio Figueiró" 
                    className="w-full h-full object-cover" 
                    onError={() => setCoverUrl(DEFAULT_RADIO_IMAGE)}
                 />
                 {/* Overlay de Vinil e Reflexos */}
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.3)_100%)]"></div>
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-30"></div>
                 {/* Centro do Disco */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 md:w-5 h-3 md:h-5 bg-black rounded-full border-2 border-white/10 shadow-inner z-10"></div>
               </div>
            </div>

            <div className="flex flex-col min-w-0 flex-grow">
              <div className="flex items-center space-x-2 mb-1">
                <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-md border transition-colors ${isPlaying ? 'bg-red-600/10 border-red-500/30' : 'bg-white/5 border-white/5'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`}></span>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${isPlaying ? 'text-red-500' : 'text-gray-500'}`}>
                    {currentSong.toLowerCase().includes("direto") ? 'Direto' : 'Emissão'}
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

              {/* Visualizador de Barras (Desktop) */}
              <div className="hidden md:flex items-end space-x-[3px] h-6 opacity-80 mt-2">
                {bars.map((bar) => (
                  <div
                    key={bar.id}
                    className="flex-grow max-w-[5px] bg-gradient-to-t from-blue-600 via-blue-400 to-white rounded-full visualizer-bar origin-bottom"
                    style={{ 
                      animationDelay: bar.delay, 
                      animationDuration: bar.duration,
                      animationPlayState: isPlaying ? 'running' : 'paused',
                      height: isPlaying ? '100%' : '15%'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CONTROLOS DO PLAYER */}
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
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${volume * 100}%` }} />
              </div>
            </div>

            <button 
              onClick={togglePlay}
              className={`relative h-14 w-14 md:h-24 md:w-24 rounded-full flex items-center justify-center transition-all duration-500 ${isPlaying ? 'bg-white text-black' : 'bg-blue-600 text-white shadow-lg'} hover:scale-105 active:scale-90 group shadow-2xl shadow-blue-600/20`}
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
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
      `}</style>
    </div>
  );
};

export default Player;
