
import React, { useState, useEffect, useRef } from 'react';

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(false);
  const [metadata, setMetadata] = useState("Web Rádio Figueiró - Direto");
  const [imgError, setImgError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const logoPath = "logo.png";
  const streamUrl = "https://rs2.ptservidor.com/proxy/orlando?mp=/stream?type=.mp3";

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const buster = `&t=${Date.now()}`;
        audioRef.current.src = `${streamUrl}${buster}`;
        audioRef.current.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleStalled = () => {
      if (isPlaying) {
        setTimeout(() => {
          const buster = `&t=${Date.now()}`;
          audio.src = `${streamUrl}${buster}`;
          audio.play();
        }, 300);
      }
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const bars = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    delay: `${Math.random() * 0.5}s`,
    duration: `${0.6 + Math.random() * 0.8}s`
  }));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] transition-all duration-500">
      <div className={`absolute inset-0 bg-blue-600/5 blur-3xl transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />

      <div className="relative bg-gray-900/95 border-t border-blue-500/20 backdrop-blur-2xl p-4 md:p-5 shadow-[0_-15px_50px_rgba(0,0,0,0.8)]">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          
          <div className="flex items-center space-x-4 md:space-x-5 w-full md:w-auto">
            <div className="relative group flex-shrink-0">
              <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${isPlaying ? 'opacity-60 animate-pulse' : ''}`} />
              <div className="relative h-16 w-16 md:h-24 md:w-24 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gray-800 flex items-center justify-center">
                {!imgError ? (
                  <img 
                    src={logoPath} 
                    alt="Logo Rádio" 
                    className="h-full w-full object-cover" 
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span className="text-blue-500 font-black text-xl italic leading-none">WRF</span>
                )}
                {isLoading && (
                   <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                     <div className="h-6 w-6 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin" />
                   </div>
                )}
              </div>
            </div>
            
            <div className="min-w-0 flex-grow">
              <div className="flex items-center space-x-2">
                <span className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`} />
                <h4 className="text-white font-black text-lg md:text-xl tracking-tight uppercase italic">Live</h4>
              </div>
              <p className="text-blue-400 text-xs md:text-sm font-bold truncate max-w-[180px] md:max-w-[300px] uppercase tracking-wider mt-0.5">
                {metadata}
              </p>
              
              <div className={`flex items-end space-x-1 h-5 md:h-6 mt-2 transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-20'}`}>
                {bars.map((bar) => (
                  <div
                    key={bar.id}
                    className="w-0.5 md:w-1 bg-blue-500/80 rounded-full visualizer-bar"
                    style={{ 
                      animationDelay: bar.delay, 
                      animationDuration: bar.duration,
                      animationPlayState: isPlaying ? 'running' : 'paused'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-1 md:space-y-2">
            <button 
              onClick={togglePlay}
              className="group relative h-14 w-14 md:h-20 md:w-20 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all transform active:scale-90 hover:scale-105"
            >
              <div className={`absolute -inset-2 bg-blue-500 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity ${isPlaying ? 'animate-pulse' : ''}`} />
              {isPlaying ? (
                <svg className="w-6 h-6 md:w-10 md:h-10 relative" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-6 h-6 md:w-10 md:h-10 ml-1 relative" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            <span className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest">
              {isPlaying ? 'A Reproduzir' : 'Pausado'}
            </span>
          </div>

          <div className="hidden lg:flex flex-col items-end space-y-2 w-56">
            <div className="flex items-center space-x-3 w-full">
              <svg className="w-5 h-5 text-blue-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
              </svg>
              <div className="relative w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Volume {Math.round(volume * 100)}%</p>
          </div>

        </div>
      </div>
      <audio ref={audioRef} />
    </div>
  );
};

export default Player;
