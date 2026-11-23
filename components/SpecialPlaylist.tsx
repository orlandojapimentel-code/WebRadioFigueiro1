import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { PLAYLIST_SONGS } from '../data/playlistSongs';
import { PlaylistItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export const SpecialPlaylist: React.FC = () => {
  const { t } = useLanguage();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const currentTrack: PlaylistItem = PLAYLIST_SONGS[currentTrackIndex] || PLAYLIST_SONGS[0];

  const pauseLiveRadio = () => {
    window.dispatchEvent(new CustomEvent('wrf-pause-radio'));
  };

  useEffect(() => {
    const handleRadioState = (e: Event) => {
      const customEvent = e as CustomEvent<{ isPlaying?: boolean }>;
      if (customEvent.detail?.isPlaying && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener('wrf-radio-state', handleRadioState);
    return () => {
      window.removeEventListener('wrf-radio-state', handleRadioState);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playTrack = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setIsLoadingAudio(true);
    pauseLiveRadio();

    if (audioRef.current) {
      audioRef.current.src = PLAYLIST_SONGS[index].audioUrl;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setIsLoadingAudio(false);
        });
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      pauseLiveRadio();
      if (!audioRef.current.src || audioRef.current.src !== currentTrack.audioUrl) {
        audioRef.current.src = currentTrack.audioUrl;
        audioRef.current.load();
      }
      setIsLoadingAudio(true);
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setIsLoadingAudio(false);
        });
    }
  };

  const handleNext = useCallback(() => {
    if (isShuffle) {
      let nextIndex = Math.floor(Math.random() * PLAYLIST_SONGS.length);
      if (PLAYLIST_SONGS.length > 1 && nextIndex === currentTrackIndex) {
        nextIndex = (nextIndex + 1) % PLAYLIST_SONGS.length;
      }
      playTrack(nextIndex);
    } else {
      playTrack((currentTrackIndex + 1) % PLAYLIST_SONGS.length);
    }
  }, [currentTrackIndex, isShuffle, playTrack]);

  const handlePrev = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const prevIndex = (currentTrackIndex - 1 + PLAYLIST_SONGS.length) % PLAYLIST_SONGS.length;
    playTrack(prevIndex);
  }, [currentTrackIndex, playTrack]);

  const handleEnded = useCallback(() => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else if (repeatMode === 'all') {
      handleNext();
    } else if (currentTrackIndex < PLAYLIST_SONGS.length - 1) {
      handleNext();
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [currentTrackIndex, handleNext, repeatMode]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (!isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
      setIsLoadingAudio(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return PLAYLIST_SONGS;
    const q = searchQuery.toLowerCase().trim();
    return PLAYLIST_SONGS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.tag.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-6">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onWaiting={() => setIsLoadingAudio(true)}
        onPlaying={() => {
          setIsLoadingAudio(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
      />

      {/* Main Playlist Player */}
      <div className="glass-card p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          {/* Vinyl Disc Visual */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-2xl bg-slate-900 dark:bg-[#05070c] border border-slate-800 dark:border-white/10 flex items-center justify-center p-3 overflow-hidden shadow-md">
            <div
              className={`w-full h-full rounded-full border-4 border-white/10 bg-gradient-to-tr from-slate-900 via-black to-slate-800 flex items-center justify-center ${
                isPlaying ? 'animate-[spin_7s_linear_infinite]' : ''
              }`}
            >
              <div className="w-4/5 h-4/5 rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-3/5 h-3/5 rounded-full border border-white/10 flex items-center justify-center bg-red-600/20">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Info & Controls */}
          <div className="flex-1 w-full space-y-4 text-center md:text-left">
            <div className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
              <span className="text-red-600 dark:text-red-400 font-bold">
                {t.playlist.trackLabel} {String(currentTrack.number).padStart(2, '0')} {t.playlist.ofWord}{' '}
                {PLAYLIST_SONGS.length}
              </span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>{currentTrack.format}</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>{currentTrack.tag}</span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-brand font-black text-slate-900 dark:text-white tracking-tight">
                {currentTrack.title}
              </h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">
                {currentTrack.artist} · Web Rádio Figueiró
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div
                ref={progressBarRef}
                onClick={handleSeek}
                className="group relative h-2 w-full rounded-full bg-slate-200 dark:bg-white/10 cursor-pointer overflow-hidden"
                title={t.playlist.clickToSeek}
              >
                <div
                  className="h-full bg-red-600 rounded-full transition-all duration-100"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                <span>{formatTime(currentTime)}</span>
                {isLoadingAudio ? (
                  <span className="text-red-600 dark:text-red-400">{t.playlist.loadingAudio}</span>
                ) : (
                  <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
                )}
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 sm:gap-3 mx-auto md:mx-0">
                <button
                  type="button"
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isShuffle
                      ? 'bg-red-50 dark:bg-red-600/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/40'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-950 dark:hover:text-white'
                  }`}
                  title={isShuffle ? t.playlist.shuffleOn : t.playlist.shuffleOff}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h4l4 6 4-6h4m-4 12l-4-6-4 6H4m16 0h-4l-4-6" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 transition-colors"
                  title={t.playlist.prev}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={togglePlay}
                  className="h-12 w-12 rounded-2xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-md shadow-red-600/25 transition-transform active:scale-95"
                  title={isPlaying ? t.playlist.pause : t.playlist.play}
                >
                  {isLoadingAudio ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 transition-colors"
                  title={t.playlist.next}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (repeatMode === 'off') setRepeatMode('all');
                    else if (repeatMode === 'all') setRepeatMode('one');
                    else setRepeatMode('off');
                  }}
                  className={`p-2 rounded-xl border transition-colors relative ${
                    repeatMode !== 'off'
                      ? 'bg-red-50 dark:bg-red-600/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/40'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-950 dark:hover:text-white'
                  }`}
                  title={
                    repeatMode === 'all'
                      ? t.playlist.repeatAll
                      : repeatMode === 'one'
                      ? t.playlist.repeatOne
                      : t.playlist.repeatOff
                  }
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {repeatMode === 'one' && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-[9px] font-bold text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">
                      1
                    </span>
                  )}
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 mx-auto md:mx-0">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
                  title={isMuted ? t.playlist.unmute : t.playlist.mute}
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
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    setVolume(newVol);
                    if (isMuted && newVol > 0) setIsMuted(false);
                  }}
                  className="w-20 accent-red-600 h-1 bg-slate-300 dark:bg-white/20 rounded-lg cursor-pointer"
                  title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracklist */}
      <div className="glass-card p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-4">
          <div>
            <h4 className="text-lg font-brand font-bold text-slate-900 dark:text-white">
              {t.playlist.tracklistTitle}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              {filteredSongs.length} {t.playlist.ofWord} {PLAYLIST_SONGS.length} {t.playlist.songsCredit}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-60">
              <input
                type="text"
                placeholder={t.playlist.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-white/[0.04] text-slate-900 dark:text-white text-xs pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 focus:border-red-500 focus:outline-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <svg
                className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => playTrack(0)}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="hidden sm:inline">{t.playlist.playAll}</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-white/[0.06] max-h-[500px] overflow-y-auto pr-1">
          {filteredSongs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
              {t.playlist.noResults} &quot;{searchQuery}&quot;.
            </div>
          ) : (
            filteredSongs.map((song) => {
              const originalIndex = PLAYLIST_SONGS.findIndex((s) => s.id === song.id);
              const isCurrent = originalIndex === currentTrackIndex;
              const isItemPlaying = isCurrent && isPlaying;

              return (
                <div
                  key={song.id}
                  onClick={() => (isCurrent ? togglePlay() : playTrack(originalIndex))}
                  className={`flex items-center justify-between py-3 px-2 sm:px-3 rounded-xl transition-colors cursor-pointer group ${
                    isCurrent
                      ? 'bg-red-50 dark:bg-red-600/10'
                      : 'hover:bg-slate-100/80 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 shrink-0 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
                      {isItemPlaying ? (
                        <div className="flex items-end gap-0.5 h-4" aria-hidden="true">
                          {[1, 2, 3].map((i) => (
                            <span
                              key={i}
                              className="w-1 h-4 bg-red-600 dark:bg-red-500 rounded-full animate-eq-bar"
                              style={{ animationDelay: `${i * 0.16}s` }}
                            />
                          ))}
                        </div>
                      ) : (
                        <>
                          <span
                            className={`text-xs font-mono font-bold tabular-nums group-hover:hidden ${
                              isCurrent ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {String(song.number).padStart(2, '0')}
                          </span>
                          <svg
                            className="w-4 h-4 text-red-600 hidden group-hover:block ml-0.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h5
                          className={`font-brand font-bold text-sm sm:text-base truncate ${
                            isCurrent
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400'
                          }`}
                        >
                          {song.title}
                        </h5>
                        {isCurrent && (
                          <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 shrink-0">
                            · {t.playlist.playingBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="hidden sm:inline text-xs font-mono text-slate-500 dark:text-slate-400">
                      {song.format} · {song.tag}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrent) togglePlay();
                        else playTrack(originalIndex);
                      }}
                      className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors ${
                        isItemPlaying
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 dark:bg-white/5 hover:bg-red-600 text-slate-700 dark:text-slate-300 hover:text-white border border-slate-200 dark:border-white/10'
                      }`}
                      title={isItemPlaying ? t.playlist.pause : t.playlist.play}
                    >
                      {isItemPlaying ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialPlaylist;
