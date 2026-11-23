import React, { useState, useRef, useEffect } from 'react';
import SpecialPlaylist from './SpecialPlaylist';
import { useLanguage } from '../contexts/LanguageContext';

interface AudioItem {
  id: string;
  title: string;
  category: string;
  audioUrl: string;
  duration?: string;
}

const CustomAudioPlayer: React.FC<{
  audio: AudioItem;
  playingLabel: string;
  readyLabel: string;
}> = ({ audio, playingLabel, readyLabel }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  return (
    <div className="glass-card glass-card-interactive p-6">
      <audio
        ref={audioRef}
        src={audio.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex items-center gap-4 sm:gap-5">
        <button
          type="button"
          onClick={togglePlay}
          className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${
            isPlaying
              ? 'bg-red-600 text-white'
              : 'bg-slate-100 dark:bg-white/10 hover:bg-red-600 text-slate-800 dark:text-white hover:text-white'
          }`}
          aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              {audio.category}
            </span>
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-3" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="w-0.5 h-3 rounded-full bg-red-600 dark:bg-red-500 animate-eq-bar"
                    style={{ animationDelay: `${i * 0.14}s` }}
                  />
                ))}
              </div>
            )}
          </div>
          <h4 className="text-slate-900 dark:text-white font-brand font-bold text-base sm:text-lg leading-snug line-clamp-2">
            {audio.title}
          </h4>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="relative h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
          <span className={isPlaying ? 'text-red-600 dark:text-red-400 font-bold' : ''}>
            {isPlaying ? playingLabel : readyLabel}
          </span>
          <span>{audio.duration}</span>
        </div>
      </div>
    </div>
  );
};

const MediaCenter: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'playlist' | 'audio' | 'video' | 'myMusic'>('playlist');

  useEffect(() => {
    const handleSetTab = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab?: string }>;
      if (customEvent.detail?.tab && ['playlist', 'audio', 'video', 'myMusic'].includes(customEvent.detail.tab)) {
        setActiveTab(customEvent.detail.tab as 'playlist' | 'audio' | 'video' | 'myMusic');
      }
    };
    window.addEventListener('wrf-set-media-tab', handleSetTab);
    return () => {
      window.removeEventListener('wrf-set-media-tab', handleSetTab);
    };
  }, []);

  const myMusicVideos = [
    { id: 'm1', title: 'Minha Música #1', youtubeId: 'AvHMFxjPSuM' },
    { id: 'm2', title: 'Minha Música #2', youtubeId: 'x91uzSqtJlw' },
    { id: 'm3', title: 'Minha Música #3', youtubeId: 'TsjKIeLXcmA' },
    { id: 'm4', title: 'Minha Música #4', youtubeId: '0B3ivU16tNE' },
    { id: 'm5', title: 'Minha Música #5', youtubeId: '-u6MT203gx0' },
    { id: 'm6', title: 'Minha Música #6', youtubeId: '82F8kJ1sGAY' },
  ];

  const audios: AudioItem[] = [
    {
      id: '1',
      title: 'Entrevista: Ás da Concertina e Vasquinho da Concertina',
      category: 'Tradição Viva',
      audioUrl:
        'https://www.dropbox.com/scl/fi/u3r7msk0h6blqpjt8mrba/Entrevista-s-da-concertina-e-Vasquinho-24-01-2025.mp3?rlkey=2sb2suromeylsn0yiwoyc67mn&st=qhx3c6fq&raw=1',
      duration: '1h 21min',
    },
    {
      id: '2',
      title: 'Prazeres Interrompidos - Promo',
      category: 'Podcast Literário',
      audioUrl:
        'https://www.dropbox.com/scl/fi/tz8ccze2co79c16pwq1jp/PROMO-Web-R-dio-Figueir.mp3?rlkey=88lpwhzqnl845jn86g4b4b7ai&st=try9kss2&raw=1',
      duration: '0:30 seg',
    },
  ];

  return (
    <div id="multimedia" className="space-y-8 scroll-mt-28">
      <div
        id="playlist-section"
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-white/[0.08] pb-6"
      >
        <div>
          <span className="text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-[0.2em] block">
            {t.media.kicker}
          </span>
          <h3 className="text-2xl sm:text-3xl font-brand font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {t.media.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{t.media.subtitle}</p>
        </div>

        {/* Segmented Filter Control */}
        <div className="inline-flex bg-slate-100 dark:bg-white/[0.05] p-1 rounded-2xl border border-slate-200 dark:border-white/10 overflow-x-auto max-w-full gap-1 shrink-0">
          {(
            [
              { id: 'playlist', label: t.media.tabs.playlist },
              { id: 'audio', label: t.media.tabs.podcasts },
              { id: 'video', label: t.media.tabs.videos },
              { id: 'myMusic', label: t.media.tabs.musicVideos },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-slate-900 dark:bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeTab === 'playlist' && <SpecialPlaylist />}

        {activeTab === 'audio' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {audios.map((audio) => (
              <CustomAudioPlayer
                key={audio.id}
                audio={audio}
                playingLabel={t.media.playing}
                readyLabel={t.media.ready}
              />
            ))}

            <a
              href="https://wa.me/351910270085"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card glass-card-interactive border-dashed p-8 flex flex-col items-center justify-center text-center min-h-[160px]"
            >
              <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 mb-3 border border-slate-200 dark:border-white/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h5 className="text-slate-900 dark:text-white font-brand font-bold text-sm">
                {t.media.suggestTitle}
              </h5>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{t.media.suggestDesc}</p>
            </a>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: '1', title: 'Emissão Especial WRF', youtubeId: 'r5GzTRSWXgc' },
              { id: '2', title: 'Destaque Musical', youtubeId: 'kjRBK718BtM' },
            ].map((video) => (
              <div key={video.id} className="glass-card glass-card-interactive overflow-hidden">
                <div className="aspect-video w-full bg-black">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`}
                    title={video.title}
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
                <div className="p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block mb-1">
                    {t.media.originalLabel}
                  </span>
                  <h4 className="font-brand font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    {video.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'myMusic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myMusicVideos.map((video) => (
              <div key={video.id} className="glass-card glass-card-interactive overflow-hidden">
                <div className="aspect-video w-full bg-black">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`}
                    title={video.title}
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-brand font-bold text-sm text-slate-900 dark:text-white truncate">
                    {video.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaCenter;
