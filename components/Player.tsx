
import React, { useState, useEffect, useRef } from 'react';

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [previousVolume, setPreviousVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(false);
  const [metadata, setMetadata] = useState("Web Rádio Figueiró - Sintonizando...");
  const [imgError, setImgError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const logoPath = "logo.png";
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
        album: 'Em Direto',
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

  const bars = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    delay: `${i * 0.05}s`,
    duration: `${0.5 + Math.random() * 1}s`
  }));

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-8 md:right-8 z-[100] transition-all duration-700">
      {/* Glow de Fundo Dinâmico */}
      <div className={`absolute -inset-4 bg-blue-600/20 blur-[100px] rounded-full transition-opacity duration-1000 ${isPlaying ? 'opacity-100 scale-110' : 'opacity-0'}`} />

      <div className="relative bg-gray-950/80 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] p-3 md:p-5 shadow-[0_20px_80px_rgba(0,0,0,0.9)] overflow-hidden group">
        
        {/* Barra de Progresso Decorativa (Simulada) */}
        <div className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full opacity-30"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Lado Esquerdo: Info & Visualizer */}
          <div className="flex items-center space-x-4 md:space-x-6 w-full md:w-auto">
            <div className="relative group flex-shrink-0">
              {/* Efeito Disco de Vinil */}
              <div className={`absolute -inset-2 bg-gradient-to-tr from-blue-600/40 to-indigo-600/40 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isPlaying ? 'opacity-100 animate-pulse' : ''}`} />
              <div className={`relative h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden shadow-2xl border-2 border-white/10 bg-gray-900 flex items-center justify-center transition-transform duration-[3000ms] ease-linear ${isPlaying ? 'rotate-[360deg] infinite' : ''}`}
                   style={{ animation: isPlaying ? 'spin 5s linear infinite' : 'none' }}>
                {!imgError ? (
                  <img src={logoPath} alt="WRF" className="h-full w-full object-cover" onError={() => setImgError(true)} />
                ) : (
                  <span className="text-blue-500 font-black text-xl italic">WRF</span>
                )}
                {/* Centro do "Disco" */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-950 rounded-full border border-white/20 shadow-inner"></div>
                </div>
              </div>
            </div>
            
            <div className="min-w-0 flex-grow">
              <div className="flex items-center space-x-2 mb-1">
                <span className="flex h-2 w-2 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-red-500' : 'bg-gray-500'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-red-600' : 'bg-gray-600'}`}></span>
                </span>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Live Stream</span>
              </div>
              
              <div className="overflow-hidden">
                <p className="text-white text-sm md:text-lg font-bold truncate uppercase tracking-wide">
                  {metadata}
                </p>
              </div>
              
              {/* Visualizer Moderno */}
              <div className="flex items-end space-x-[2px] h-6 mt-2">
                {bars.map((bar) => (
                  <div
                    key={bar.id}
                    className="w-1 bg-gradient-to-t from-blue-600 via-blue-400 to-indigo-400 rounded-full visualizer-bar origin-bottom"
                    style={{ 
                      animationDelay: bar.delay, 
                      animationDuration: bar.duration,
                      animationPlayState: isPlaying ? 'running' : 'paused',
                      opacity: isPlaying ? 1 : 0.2,
                      transform: isPlaying ? 'none' : 'scaleY(0.2)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Centro: Controles Principais */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={togglePlay}
              className="group relative h-16 w-16 md:h-20 md:w-20 bg-white text-gray-950 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(255,255,255,0.2)] transition-all transform active:scale-90 hover:scale-110 hover:shadow-white/30"
            >
              {isPlaying ? (
                <svg className="w-8 h-8 md:w-10 md:h-10 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-8 h-8 md:w-10 md:h-10 ml-1 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
          </div>

          {/* Direita: Volume & Ferramentas */}
          <div className="flex items-center space-x-4 w-full md:w-auto justify-center md:justify-end">
            <div className="flex items-center bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 group/vol">
              <button onClick={toggleMute} className="text-white/60 hover:text-blue-400 transition-colors mr-3">
                {volume === 0 ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                )}
              </button>
              <div className="relative w-24 md:w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                <input 
                  type="range" min="0" max="1" step="0.01" value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-300" style={{ width: `${volume * 100}%` }} />
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Estilo Global para Animação de Rotação */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <audio ref={audioRef} />
    </div>
  );
};

export default Player;
