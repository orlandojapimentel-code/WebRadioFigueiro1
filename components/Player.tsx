
import React, { useState, useEffect, useRef } from 'react';

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(false);
  const [metadata, setMetadata] = useState("Web Rádio Figueiró - Direto");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const streamUrl = "https://rs2.ptservidor.com/proxy/orlando?mp=/stream?type=.mp3";

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Cache-busting on play/reconnect
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
      console.log("Audio stalled, reconnecting...");
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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-gray-900/95 border-t border-blue-500/30 backdrop-blur-xl p-4 md:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Album Art / Info */}
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className={`relative h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden shadow-2xl flex-shrink-0 group ${isPlaying ? 'animate-pulse' : ''}`}>
             <img src="logo.png" alt="Rádio Art" className="h-full w-full object-cover" />
             {isPlaying && (
               <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                 <div className="flex space-x-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`w-1 bg-white rounded-full animate-bounce h-4`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                 </div>
               </div>
             )}
          </div>
          <div className="min-w-0">
            <h4 className="text-white font-bold truncate text-lg">Em Direto</h4>
            <p className="text-blue-400 text-sm truncate animate-pulse font-medium">{metadata}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={togglePlay}
            className="h-16 w-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all transform active:scale-95"
          >
            {isLoading ? (
               <div className="h-8 w-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
        </div>

        {/* Volume & Misc */}
        <div className="hidden md:flex items-center space-x-4 w-48">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <audio ref={audioRef} />
      </div>
    </div>
  );
};

export default Player;
