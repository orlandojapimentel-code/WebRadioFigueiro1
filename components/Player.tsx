
import React, { useState, useEffect, useRef } from 'react';

const Player: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [previousVolume, setPreviousVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const streamUrl = "https://rs2.ptservidor.com/proxy/orlando?mp=/stream?type=.mp3";

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

  const bars = Array.from({ length: 32 }, (_, i) => ({
    id: i,
    delay: `${i * 0.03}s`,
    duration: `${0.5 + Math.random() * 0.7}s`
  }));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pointer-events-none">
      <div className="container mx-auto max-w-6xl relative">
        <div className={`relative bg-gray-950/90 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] p-3 md:p-4 shadow-2xl flex flex-col md:flex-row items-center gap-4 transition-all pointer-events-auto ${isPlaying ? 'ring-2 ring-blue-500/20' : ''}`}>
          
          <div className="flex items-center space-x-5 w-full md:w-auto flex-grow min-w-0">
            {/* Contentor da Capa do Disco / Logo */}
            <div className={`relative h-16 w-16 md:h-20 md:w-20 rounded-full bg-white dark:bg-gray-800 p-1 shadow-2xl transition-transform duration-700 ${isPlaying ? 'animate-spin-slow' : 'scale-95'}`}>
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gray-900 relative">
                {/* Widget de Capa do Disco Centova Cast */}
                <img 
                  className="cc_streaminfo absolute inset-0 w-full h-full object-cover" 
                  data-type="cover" 
                  data-username="orlando" 
                  alt="Capa do Disco"
                  onError={(e) => {
                    e.currentTarget.src = "./logo.png"; // Fallback para o logo se não houver capa
                  }}
                />
                {/* Overlay central decorativo para parecer um disco real */}
                <div className="absolute w-3 h-3 bg-gray-950 rounded-full border border-white/20 z-10"></div>
              </div>
            </div>

            <div className="flex flex-col min-w-0 flex-grow">
              <div className="flex items-center space-x-2 mb-1.5">
                <div className="flex items-center space-x-1.5 bg-red-600/10 px-2 py-0.5 rounded-md border border-red-500/20">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></span>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500">ON AIR</span>
                </div>
              </div>
              
              <div className="overflow-hidden mb-2">
                <h3 className="text-white text-sm md:text-lg font-brand font-black tracking-tighter truncate">
                  <span className="cc_streaminfo" data-type="song" data-username="orlando">Sintonizando...</span>
                </h3>
              </div>

              <div className="flex items-end space-x-[2px] h-5 opacity-80">
                {bars.map((bar) => (
                  <div
                    key={bar.id}
                    className="flex-grow max-w-[4px] bg-gradient-to-t from-blue-600 via-blue-400 to-indigo-400 rounded-full visualizer-bar origin-bottom"
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

          <div className="flex items-center space-x-6">
            <button 
              onClick={togglePlay}
              className={`relative h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-white text-gray-950 shadow-blue-500/20' : 'bg-blue-600 text-white shadow-blue-600/40'} shadow-2xl hover:scale-105 active:scale-90`}
            >
              {isPlaying ? (
                <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-8 h-8 md:w-10 md:h-10 ml-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-6 min-w-[200px]">
            <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-2xl border border-white/5 flex-grow">
              <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
                {volume === 0 ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                )}
              </button>
              <div className="relative flex-grow h-1.5 bg-gray-800 rounded-full overflow-hidden">
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
      <audio ref={audioRef} preload="none" />
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
      `}</style>
    </div>
  );
};

export default Player;
