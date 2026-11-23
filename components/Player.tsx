import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { MEDIA_ASSETS } from '../src/mediaAssets';

const Player: React.FC = () => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [songTitle, setSongTitle] = useState(t.player.tuning);
  const [coverUrl, setCoverUrl] = useState(MEDIA_ASSETS.playerDefaultVinyl);
  const [copied, setCopied] = useState(false);
  const songTitleRef = useRef(t.player.tuning);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamUrl = 'https://rs2.ptservidor.com/proxy/orlando?mp=/stream';

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('wrf-radio-state', { detail: { isPlaying } }));
  }, [isPlaying]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('wrf-now-playing', { detail: { song: songTitle } }));
  }, [songTitle]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = `${streamUrl}&t=${Date.now()}`;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.error('Erro ao reproduzir áudio:', e);
          setIsPlaying(false);
        });
    }
  };

  useEffect(() => {
    const handleToggle = () => {
      togglePlay();
    };
    const handlePause = () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener('wrf-toggle-play', handleToggle);
    window.addEventListener('wrf-pause-radio', handlePause);
    return () => {
      window.removeEventListener('wrf-toggle-play', handleToggle);
      window.removeEventListener('wrf-pause-radio', handlePause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, volume, isMuted]);

  const fetchAlbumArt = async (title: string) => {
    if (!title || title.includes('Sintonizando') || title.toLowerCase().includes('web rádio')) return;
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(title)}&media=music&limit=1`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0 && data.results[0].artworkUrl100) {
        setCoverUrl(data.results[0].artworkUrl100.replace('100x100', '600x600'));
      }
    } catch {
      // Keep current or default artwork silently
    }
  };

  useEffect(() => {
    const proxyId = 'cc_strinfo_song_orlando';
    let proxy = document.getElementById(proxyId);

    if (!proxy) {
      proxy = document.createElement('span');
      proxy.id = proxyId;
      proxy.className = 'cc_streaminfo';
      proxy.style.display = 'none';
      proxy.setAttribute('data-type', 'song');
      proxy.setAttribute('data-username', 'orlando');
      document.body.appendChild(proxy);
    }

    const updateSong = () => {
      if (!proxy) return;
      const newSong = (proxy.textContent || proxy.innerText || '').trim();
      const isPlaceholder =
        !newSong ||
        newSong.includes('cc_streaminfo') ||
        newSong.toLowerCase() === 'loading...' ||
        newSong.toLowerCase() === 'sintonizando...';

      if (!isPlaceholder && newSong !== songTitleRef.current) {
        songTitleRef.current = newSong;
        setSongTitle(newSong);
        fetchAlbumArt(newSong);
      }
    };

    const fetchFromApi = async () => {
      try {
        const response = await fetch('https://rs2.ptservidor.com:2199/rpc/orlando/streaminfo.get');
        const data = await response.json();
        if (data && data.data && data.data[0] && data.data[0].song) {
          const apiSong = data.data[0].song.trim();
          if (apiSong && apiSong !== songTitleRef.current && !apiSong.toLowerCase().includes('sintonizando')) {
            songTitleRef.current = apiSong;
            setSongTitle(apiSong);
            fetchAlbumArt(apiSong);
          }
        }
      } catch {
        // Fallback silently
      }
    };

    const observer = new MutationObserver(updateSong);
    observer.observe(proxy, { childList: true, characterData: true, subtree: true });

    updateSong();
    fetchFromApi();

    const interval = setInterval(() => {
      updateSong();
      fetchFromApi();
    }, 15000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (newVol > 0 && isMuted) setIsMuted(false);
    if (audioRef.current) audioRef.current.volume = newVol;
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const copySong = () => {
    if (songTitle && songTitle !== t.player.tuning) {
      navigator.clipboard.writeText(songTitle);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isTuningPlaceholder =
    !songTitle ||
    songTitle === t.player.tuning ||
    songTitle.toLowerCase().includes('sintonizando') ||
    songTitle.toLowerCase().includes('tuning') ||
    songTitle.toLowerCase().includes('syntonisation');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[160] p-2.5 sm:p-4 pointer-events-none">
      <div className="container mx-auto max-w-5xl w-full">
        <div
          className={`pointer-events-auto bg-white/95 dark:bg-[#0b0e17]/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl px-3 py-2 sm:px-5 sm:py-3.5 border transition-all duration-300 shadow-[0_14px_40px_-10px_rgba(15,23,42,0.22)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.65)] flex items-center justify-between gap-3 sm:gap-5 ${
            isPlaying
              ? 'border-red-500/40 dark:border-red-500/40'
              : 'border-slate-200 dark:border-white/10'
          }`}
        >
          {/* Album Art + Track Details */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="relative h-11 w-11 sm:h-14 sm:w-14 shrink-0">
              <div
                className={`w-full h-full rounded-full border-2 sm:border-4 border-slate-900 dark:border-black overflow-hidden bg-slate-950 shadow-md ${
                  isPlaying ? 'animate-[spin_18s_linear_infinite]' : ''
                }`}
              >
                <img
                  key={coverUrl}
                  src={coverUrl}
                  alt="Capa da música em reprodução"
                  referrerPolicy="no-referrer"
                  onError={() => setCoverUrl(MEDIA_ASSETS.playerDefaultVinyl)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-900 border border-white/30 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-red-500" />
                </div>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-0.5 h-3 shrink-0" aria-hidden="true">
                  {[1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={`w-0.5 rounded-full bg-red-600 dark:bg-red-500 ${
                        isPlaying ? 'animate-eq-bar h-3' : 'h-1 opacity-30'
                      }`}
                      style={isPlaying ? { animationDelay: `${i * 0.12}s` } : undefined}
                    />
                  ))}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider truncate ${
                    isPlaying ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isPlaying ? t.player.live : t.player.standby}
                </span>
              </div>

              <div className="flex items-center gap-1.5 min-w-0 mt-0.5">
                <p className="font-brand font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                  {songTitle}
                </p>

                {!isTuningPlaceholder && (
                  <button
                    type="button"
                    onClick={copySong}
                    title={copied ? t.player.copied : t.player.copyTitle}
                    aria-label={copied ? t.player.copied : t.player.copyTitle}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shrink-0"
                  >
                    {copied ? (
                      <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Quick Mute */}
            <button
              type="button"
              onClick={toggleMute}
              className="md:hidden h-10 w-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
              title={isMuted ? t.player.unmute : t.player.mute}
              aria-label={isMuted ? t.player.unmute : t.player.mute}
            >
              {isMuted || volume === 0 ? (
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>

            {/* Desktop Volume Slider */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-white/[0.05] px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={toggleMute}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
                title={isMuted ? t.player.unmute : t.player.mute}
                aria-label={isMuted ? t.player.unmute : t.player.mute}
              >
                {isMuted || volume === 0 ? (
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 h-1 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                aria-label="Volume"
              />
            </div>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              className={`h-11 w-11 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center transition-transform active:scale-95 shadow-md ${
                isPlaying
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
              }`}
              title={isPlaying ? t.player.pause : t.player.play}
              aria-label={isPlaying ? t.player.pause : t.player.play}
            >
              {isPlaying ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={streamUrl} preload="none" />
    </div>
  );
};

export default Player;
