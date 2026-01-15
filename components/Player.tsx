
import React, { useState, useEffect, useRef } from 'react';

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [previousVolume, setPreviousVolume] = useState(0.8);
  const [metadata, setMetadata] = useState("Web Rádio Figueiró - Sintonizando...");
  const [imgError, setImgError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const logoPath = "./logo.png";
  const streamUrl = "https://rs2.ptservidor.com/proxy/orlando?mp=/stream?type=.mp3";
  const statsUrl = "https://rs2.ptservidor.com/proxy/orlando?mp=/status-json.xsl";

  const fetchMetadata = async () => {
    try {
      const response = await fetch(statsUrl, { cache: 'no-store' });
      if (!response.ok) throw new Error('Falha ao obter metadados');
      const data = await response.json();
      const source = data.icestats.source;
      let title = "";
      
      if (Array.isArray(source)) {
        const active = source.find(s => s.title || s.artist);
        title = active ? (active.title || `${active.artist} - ${active.song}`) : "Web Rádio Figueiró - Direto";
      } else if (source) {
        title = source.title || (source.artist ? `${source.artist} - ${source.title}` : "Web Rádio Figueiró - Direto");
      }

      if (title && title !== metadata) {
        setMetadata(title);
        updateMediaSession(title);
      }
    } catch (error) {
      if (metadata === "Web Rádio Figueiró - Sintonizando...") {
        setMetadata("Web Rádio Figueiró - Direto");
      }
    }
  };

  const updateMediaSession = (title: string) => {
    if ('mediaSession' in navigator) {
      const parts = title.split(' - ');
      navigator.mediaSession.metadata = new MediaMetadata({
        title: parts[1] || parts[0],
        artist: parts[1] ? parts[0] : 'Web Rádio Figueiró',
        artwork: [{ src: logoPath, sizes: '512x512', type: 'image/png' }]
      });
    }
  };

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
    fetchMetadata();
    const interval = setInterval(fetchMetadata, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Visualizer bars
  const bars = Array.from({ length: 32 }, (_, i) => ({
    id: i,
    delay: `${i * 0.03}s`,
    duration: `${0.5 + Math.random() * 0.7}s`
  }));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pointer-events-none">
      <div className="container mx-auto max-w-6xl relative">
        
        {/* Glow de Fundo quando está a tocar */}
        <div className={`absolute -inset-10 bg-blue-600/20 blur-[100px] rounded-full transition-all duration-1000 pointer-events-none ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />

        {/* Corpo do Player */}
        <div className={`relative bg-gray-950/90 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] p-3 md:p-4 shadow-[0_20px_80px_rgba(0,0,0,0.6)] flex flex-col md:flex-row items-center gap-4 transition-all duration-500 pointer-events-auto ${isPlaying ? 'ring-2 ring-blue-500/20' : ''}`}>
          
          {/* SECÇÃO ESQUERDA: LOGO E INFO */}
          <div className="flex items-center space-x-5 w-full md:w-auto flex-grow min-w-0">
            
            {/* Logo Giratório (Estilo Disco) */}
            <div className="relative flex-shrink-0 group">
              <div className={`absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur transition-opacity duration-1000 ${isPlaying ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
              <div className={`relative h-16 w-16 md:h-20 md:w-20 rounded-full bg-white dark:bg-gray-800 p-1.5 shadow-2xl border border-white/10 transition-transform duration-700 ${isPlaying ? 'animate-spin-slow' : 'scale-95'}`}>
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-900 relative">
                  {!imgError ? (
                    <img src={logoPath} alt="WRF" className="w-full h-full object-contain" onError={() => setImgError(true)} />
                  ) : (
                    <span className="text-blue-600 dark:text-blue-500 font-black text-2xl italic">F</span>
                  )}
                  {/* Orifício central do "disco" */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-950 rounded-full border border-white/20 shadow-inner"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadados e Visualizador */}
            <div className="flex flex-col min-w-0 flex-grow">
              <div className="flex items-center space-x-2 mb-1.5">
                <div className="flex items-center space-x-1.5 bg-red-600/10 px-2 py-0.5 rounded-md border border-red-500/20">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></span>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500">ON AIR</span>
                </div>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest hidden sm:inline">Emissão Digital HD</span>
              </div>
              
              <div className="overflow-hidden mb-2">
                <h3 className="text-white text-sm md:text-lg font-brand font-black tracking-tighter truncate">
                  {metadata}
                </h3>
              </div>

              {/* Espectro de Áudio */}
              <div className="flex items-end space-x-[2px] h-5 opacity-80">
                {bars.map((bar) => (
                  <div
                    key={bar.id}
                    className="flex-grow max-w-[4px] bg-gradient-to-t from-blue-600 via-blue-400 to-indigo-400 rounded-full visualizer-bar origin-bottom"
                    style={{ 
                      animationDelay: bar.delay, 
                      animationDuration: bar.duration,
                      animationPlayState: isPlaying ? 'running' : 'paused',
                      height: isPlaying ? '100%' : '15%',
                      transition: 'height 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* SECÇÃO CENTRAL: CONTROLOS DE PLAY */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={togglePlay}
              className={`group relative h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center transition-all duration-500 active:scale-90 ${isPlaying ? 'bg-white text-gray-950 shadow-blue-500/20' : 'bg-blue-600 text-white shadow-blue-600/40'} shadow-2xl hover:scale-105`}
            >
              <div className={`absolute inset-0 rounded-full border-2 border-current opacity-20 group-hover:scale-110 transition-transform ${isPlaying ? 'animate-ping' : ''}`} />
              {isPlaying ? (
                <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-8 h-8 md:w-10 md:h-10 ml-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
          </div>

          {/* SECÇÃO DIREITA: VOLUME E OPÇÕES */}
          <div className="hidden lg:flex items-center space-x-6 min-w-[200px]">
            <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-2xl border border-white/5 flex-grow">
              <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
                {volume === 0 ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                )}
              </button>
              <div className="relative flex-grow h-1.5 bg-gray-800 rounded-full overflow-hidden group/vol">
                <input 
                  type="range" min="0" max="1" step="0.01" value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${volume * 100}%` }} />
              </div>
            </div>
            
            <button className="p-3 text-gray-500 hover:text-white transition-colors" title="Definições de Som">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
            </button>
          </div>

        </div>
      </div>

      <audio ref={audioRef} preload="none" />

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        @keyframes wave {
          0%, 100% { height: 15%; opacity: 0.5; }
          50% { height: 100%; opacity: 1; }
        }
        .visualizer-bar {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Player;
