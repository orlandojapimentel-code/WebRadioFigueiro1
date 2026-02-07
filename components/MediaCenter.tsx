
import React, { useState, useEffect, useRef } from 'react';

interface VideoItem {
  id: string;
  title: string;
  youtubeId: string;
}

interface AudioItem {
  id: string;
  title: string;
  category: string;
  audioUrl: string;
  duration?: string;
}

const CustomAudioPlayer: React.FC<{ audio: AudioItem }> = ({ audio }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Stop other audios if necessary? (optional behavior)
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="relative group bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] p-6 transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
      <audio 
        ref={audioRef} 
        src={audio.audioUrl} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={handleEnded}
      />
      
      <div className="flex items-center space-x-5">
        {/* Play Button */}
        <button 
          onClick={togglePlay}
          className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
            isPlaying 
            ? 'bg-white text-blue-600' 
            : 'bg-blue-600 text-white hover:bg-blue-500'
          }`}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        {/* Text Info */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${
              audio.category === 'Podcast' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
            }`}>
              {audio.category}
            </span>
            {isPlaying && (
              <div className="flex space-x-0.5 h-2 items-end">
                <div className="w-0.5 h-full bg-blue-500 animate-bounce" style={{animationDuration: '0.6s'}}></div>
                <div className="w-0.5 h-2/3 bg-blue-500 animate-bounce" style={{animationDuration: '0.8s'}}></div>
                <div className="w-0.5 h-full bg-blue-500 animate-bounce" style={{animationDuration: '0.5s'}}></div>
              </div>
            )}
          </div>
          <h4 className="text-slate-900 dark:text-white font-bold text-sm md:text-base leading-tight tracking-tight line-clamp-2">
            {audio.title}
          </h4>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="mt-6 flex flex-col space-y-2">
        <div className="relative h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500">
           <span>{isPlaying ? 'A reproduzir' : 'Pronto a ouvir'}</span>
           <span className="text-blue-600/60">{audio.duration || 'Web Rádio Figueiró'}</span>
        </div>
      </div>
    </div>
  );
};

const MediaCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('audio');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const videos: VideoItem[] = [
    { id: '1', title: "Web Rádio Figueiró - Emissão Especial", youtubeId: "r5GzTRSWXgc" }, 
    { id: '2', title: "Destaque Musical WRF", youtubeId: "kjRBK718BtM" },
  ];

  const audios: AudioItem[] = [
    { 
      id: '1', 
      title: "Entrevista: Ás da Concertina e Vasquinho da Concertina", 
      category: "Destaque Popular", 
      audioUrl: "https://www.dropbox.com/scl/fi/u3r7msk0h6blqpjt8mrba/Entrevista-s-da-concertina-e-Vasquinho-24-01-2025.mp3?rlkey=2sb2suromeylsn0yiwoyc67mn&st=qhx3c6fq&raw=1",
      duration: "1h 21min"
    },
    { 
      id: '2', 
      title: "Prazeres Interrompidos - Promo", 
      category: "Podcast", 
      audioUrl: "https://www.dropbox.com/scl/fi/tz8ccze2co79c16pwq1jp/PROMO-Web-R-dio-Figueir.mp3?rlkey=88lpwhzqnl845jn86g4b4b7ai&st=try9kss2&raw=1",
      duration: "0:30 seg"
    },
  ];

  return (
    <div className="space-y-10 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 dark:border-white/5 pb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Centro Multimédia</h3>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Conteúdos Premium</p>
          </div>
        </div>

        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-gray-200 dark:border-white/10 w-fit">
          <button 
            onClick={() => setActiveTab('video')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'video' ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xl' : 'text-slate-500 dark:text-gray-400 hover:text-blue-600'}`}
          >
            Vídeos
          </button>
          <button 
            onClick={() => setActiveTab('audio')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'audio' ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xl' : 'text-slate-500 dark:text-gray-400 hover:text-blue-600'}`}
          >
            Podcasts
          </button>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'video' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="group relative bg-gray-900 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl transition-all hover:-translate-y-2">
                <div className="aspect-video w-full bg-black flex items-center justify-center">
                  <iframe 
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.youtubeId}?origin=${origin}&enablejsapi=1&rel=0`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-8 bg-gradient-to-t from-gray-950 to-transparent">
                  <h4 className="text-white font-bold text-lg tracking-tight">{video.title}</h4>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">YouTube Oficial</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {audios.map((audio) => (
              <CustomAudioPlayer key={audio.id} audio={audio} />
            ))}
            
            {/* Call to Action for more podcasts */}
            <div className="bg-slate-50 dark:bg-white/[0.02] border border-dashed border-gray-200 dark:border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/5 flex items-center justify-center text-gray-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              </div>
              <h5 className="text-slate-900 dark:text-white font-bold text-sm">Mais conteúdos brevemente</h5>
              <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mt-1">Fique Sintonizado</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaCenter;
