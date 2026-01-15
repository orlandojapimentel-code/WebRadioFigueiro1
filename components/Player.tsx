
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

  const bars = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    delay: `${i * 0.04}s`,
    duration: `${0.4 + Math.random() * 0.8}s`
  }));

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-8 md:right-8 z-[70] transition-all duration-700 pointer-events-none">
      <div className={`absolute -inset-10 bg-blue-600/10 blur-[120px] rounded-full transition-opacity duration-1000 pointer-events-none ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />

      <div className="relative bg-gray-950/90 border border-white/5 backdrop-blur-3xl rounded-[2.5rem] p-3 md:p-5 shadow-[0_32px_120px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-6 w-full md:w-auto">
            {/* LOGO DO PLAYER COM BRANDING */}
            <div className="relative flex-shrink-0">
              <div className={`absolute -inset-2 bg-blue-600/30 rounded-full blur-md transition-opacity duration-1000 ${isPlaying ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
              <div className={`relative h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-2xl border-2 border-white/5 ${isPlaying ? 'animate-spin-slow' : ''}`}
                   style={{ animationDuration: '12s' }}>
                {!imgError ? (
                  <img src={logoPath} alt="WRF" className="h-[75%] w-[75%] object-contain" onError={() => setImgError(true)} />
                ) : (
                  <span className="text-blue-600 font-black text-xl italic leading-none">F</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
              </div>
            </div>
            
            <div className="min-w-0 flex-grow">
              <div className="flex items-center space-x-2 mb-1">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-red-500' : 'bg-gray-500'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isPlaying ? 'bg-red-600' : 'bg-gray-600'}`}></span>
                </span>
                <span className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em]">Em Direto</span>
              </div>
              
              <p className="text-white text-sm md:text-lg font-brand font-bold truncate tracking-tight mb-2">
                {metadata}
              </p>
              
              <div className="flex items-end space-x-[2px] h-4">
                {bars.map((bar) => (
                  <div
                    key={bar.id}
                    className="w-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-full visualizer-bar origin-bottom"
                    style={{ 
                      animationDelay: bar.delay, 
                      animationDuration: bar.duration,
                      animationPlayState: isPlaying ? 'running' : 'paused',
                      opacity: isPlaying ? 0.8 : 0.1,
                      transform: isPlaying ? 'none' : 'scaleY(0.2)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <button 
              onClick={togglePlay}
              className="group relative h-16 w-16 md:h-20 md:w-20 bg-white hover:bg-blue-50 text-gray-950 rounded-full flex items-center justify-center shadow-xl transition-all transform active:scale-95 hover:scale-105"
            >
              {isPlaying ? (
                <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-8 h-8 md:w-10 md:h-10 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            
            <div className="hidden md:flex items-center space-x-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
              <button onClick={toggleMute} className="text-white/40 hover:text-blue-400 transition-colors">
                {volume === 0 ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                )}
              </button>
              <div className="relative w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                <input 
                  type="range" min="0" max="1" step="0.01" value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${volume * 100}%` }} />
              </div>
            </div>
          </div>

        </div>
      </div>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow linear infinite;
        }
      `}</style>
      <audio ref={audioRef} />
    </div>
  );
};

export default Player;
