import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { PLAYLIST_SONGS } from '../data/playlistSongs';
import { PlaylistItem } from '../types';

export const SpecialPlaylist: React.FC = () => {
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

  // Pause radio broadcast when playing local playlist
  const pauseLiveRadio = () => {
    window.dispatchEvent(new CustomEvent('wrf-pause-radio'));
  };

  // If live radio starts playing, pause this playlist player
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

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Load and play track
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
      if (!audioRef.current.src || audioRef.current.src === '' || audioRef.current.src !== currentTrack.audioUrl) {
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
      const nextIndex = (currentTrackIndex + 1) % PLAYLIST_SONGS.length;
      playTrack(nextIndex);
    }
  }, [currentTrackIndex, isShuffle, playTrack]);

  const handlePrev = useCallback(() => {
    // If current time > 3s, restart current track
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
    } else {
      // Off: if last track, stop; otherwise next
      if (currentTrackIndex < PLAYLIST_SONGS.length - 1) {
        handleNext();
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
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

  // Seek bar interaction
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Time format helper (mm:ss)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Filter songs by search query
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
      {/* Hidden Audio Element */}
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

      {/* Main Interactive Player Box */}
      <div className="glass-card relative overflow-hidden p-6 sm:p-8 border border-white/15 bg-gradient-to-br from-[#0c101c]/90 via-[#07090e]/95 to-[#160a10]/80 rounded-3xl shadow-2xl">
        {/* Glow backdrop decoration */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          {/* Vinyl / Cover Art Graphic */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-2xl bg-[#05070c] border border-white/15 shadow-xl flex items-center justify-center p-3 group overflow-hidden">
            {/* Spinning vinyl disc effect */}
            <div
              className={`w-full h-full rounded-full border-4 border-white/10 bg-gradient-to-tr from-slate-900 via-black to-slate-800 flex items-center justify-center shadow-inner transition-transform duration-700 ${
                isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
              }`}
            >
              {/* Disc grooves */}
              <div className="w-4/5 h-4/5 rounded-full border border-white/5 flex items-center justify-center">
                <div className="w-3/5 h-3/5 rounded-full border border-white/10 flex items-center justify-center bg-red-600/20">
                  <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                </div>
              </div>
            </div>

            {/* Floating Equalizer pill when playing */}
            {isPlaying && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-1 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-full border border-red-500/30 shadow-lg">
                <span className="w-1 h-3 bg-red-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                <span className="w-1 h-4 bg-red-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.2s]" />
                <span className="w-1 h-2 bg-red-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.4s]" />
              </div>
            )}
          </div>

          {/* Track Info & Progress */}
          <div className="flex-1 w-full space-y-4 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase tracking-wider">
                Música {currentTrack.number} de {PLAYLIST_SONGS.length}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10 text-[10px] font-mono font-bold">
                {currentTrack.format}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                {currentTrack.tag}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-brand font-black text-white tracking-tight leading-tight">
                {currentTrack.title}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-1 flex items-center justify-center md:justify-start gap-2">
                <span>{currentTrack.artist}</span>
                <span className="text-slate-500">•</span>
                <span className="text-red-400 text-xs">Web Rádio Figueiró</span>
              </p>
            </div>

            {/* Progress Bar & Timers */}
            <div className="space-y-1.5 pt-1">
              <div
                ref={progressBarRef}
                onClick={handleSeek}
                className="group relative h-2.5 w-full rounded-full bg-white/10 cursor-pointer overflow-hidden transition-all hover:h-3"
                title="Clique para avançar/recuar"
              >
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-100 relative shadow-[0_0_12px_rgba(220,38,38,0.7)]"
                  style={{ width: `${progressPercent}%` }}
                >
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 px-0.5">
                <span>{formatTime(currentTime)}</span>
                {isLoadingAudio ? (
                  <span className="text-red-400 text-[10px] animate-pulse">A carregar áudio...</span>
                ) : (
                  <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
                )}
              </div>
            </div>

            {/* Playback Controls & Settings */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {/* Main buttons: Prev, Play, Next */}
              <div className="flex items-center space-x-2 sm:space-x-3 mx-auto md:mx-0">
                {/* Shuffle Button */}
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`p-2 rounded-xl border transition-all ${
                    isShuffle
                      ? 'bg-red-600/20 text-red-400 border-red-500/40 shadow-sm'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                  title={isShuffle ? 'Modo Aleatório Ativado' : 'Ativar Modo Aleatório'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h4l4 6 4-6h4m-4 12l-4-6-4 6H4m16 0h-4l-4-6" />
                  </svg>
                </button>

                {/* Previous */}
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-all active:scale-95"
                  title="Música anterior"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </button>

                {/* Big Play / Pause */}
                <button
                  onClick={togglePlay}
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 ring-4 ring-red-500/20 hover:ring-red-500/40 transition-all transform active:scale-95"
                  title={isPlaying ? 'Pausar música' : 'Reproduzir música'}
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

                {/* Next */}
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-all active:scale-95"
                  title="Próxima música"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </button>

                {/* Repeat Button */}
                <button
                  onClick={() => {
                    if (repeatMode === 'off') setRepeatMode('all');
                    else if (repeatMode === 'all') setRepeatMode('one');
                    else setRepeatMode('off');
                  }}
                  className={`p-2 rounded-xl border transition-all relative ${
                    repeatMode !== 'off'
                      ? 'bg-red-600/20 text-red-400 border-red-500/40'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                  title={
                    repeatMode === 'all'
                      ? 'Repetir toda a playlist'
                      : repeatMode === 'one'
                      ? 'Repetir esta música'
                      : 'Repetição desativada'
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
                    <span className="absolute -top-1 -right-1 bg-red-600 text-[8px] font-black text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">
                      1
                    </span>
                  )}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 mx-auto md:mx-0">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-400 hover:text-white transition-colors"
                  title={isMuted ? 'Desativar mudo' : 'Silenciar'}
                >
                  {isMuted || volume === 0 ? (
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      />
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
                  className="w-16 sm:w-20 accent-red-600 h-1 bg-white/20 rounded-lg cursor-pointer"
                  title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Controls & Tracklist */}
      <div className="glass-card p-5 sm:p-7 rounded-3xl border border-white/10 space-y-5">
        {/* Header bar: Title, Search, and Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-red-600/10 border border-red-500/20 rounded-xl text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-brand font-black text-white tracking-tight">
                Lista de Faixas
              </h4>
              <p className="text-xs text-slate-400">
                {filteredSongs.length} de {PLAYLIST_SONGS.length} canções de Orlando José Pimentel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Pesquisar música..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.04] text-white text-xs pl-9 pr-8 py-2 rounded-xl border border-white/10 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-all placeholder:text-slate-500"
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
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Play All Button */}
            <button
              onClick={() => playTrack(0)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-600/30 flex items-center space-x-1.5 shrink-0"
              title="Iniciar reprodução do início"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="hidden sm:inline">Tocar Todas</span>
            </button>
          </div>
        </div>

        {/* Songs List */}
        <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
          {filteredSongs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Nenhuma música encontrada para &quot;{searchQuery}&quot;.
            </div>
          ) : (
            filteredSongs.map((song) => {
              const originalIndex = PLAYLIST_SONGS.findIndex((s) => s.id === song.id);
              const isCurrent = originalIndex === currentTrackIndex;
              const isItemPlaying = isCurrent && isPlaying;

              return (
                <div
                  key={song.id}
                  onClick={() => {
                    if (isCurrent) {
                      togglePlay();
                    } else {
                      playTrack(originalIndex);
                    }
                  }}
                  className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer group ${
                    isCurrent
                      ? 'bg-red-600/10 border-red-500/40 shadow-md shadow-red-600/10'
                      : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/5 hover:border-white/15'
                  }`}
                >
                  {/* Left: Number / Play icon, Title, Artist */}
                  <div className="flex items-center space-x-3.5 sm:space-x-4 min-w-0">
                    {/* Index or Play Button */}
                    <div className="w-9 h-9 shrink-0 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-red-500/40 transition-colors">
                      {isItemPlaying ? (
                        <div className="flex items-end gap-0.5 h-4">
                          <span className="w-1 h-3 bg-red-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                          <span className="w-1 h-4 bg-red-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.2s]" />
                          <span className="w-1 h-2 bg-red-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.4s]" />
                        </div>
                      ) : (
                        <>
                          <span
                            className={`text-xs font-mono font-bold group-hover:hidden ${
                              isCurrent ? 'text-red-400' : 'text-slate-400'
                            }`}
                          >
                            {String(song.number).padStart(2, '0')}
                          </span>
                          <svg
                            className="w-4 h-4 text-red-500 hidden group-hover:block ml-0.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h5
                          className={`font-brand font-bold text-sm sm:text-base tracking-tight truncate ${
                            isCurrent ? 'text-red-400 font-black' : 'text-white group-hover:text-red-300'
                          }`}
                        >
                          {song.title}
                        </h5>
                        {isCurrent && (
                          <span className="shrink-0 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-wider">
                            A tocar
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-400 truncate mt-0.5">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  {/* Right: Format, Tag, and Open link */}
                  <div className="flex items-center space-x-2.5 shrink-0 ml-3">
                    <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                      {song.format}
                    </span>
                    <span className="hidden md:inline-block px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-300">
                      {song.tag}
                    </span>

                    {/* Quick play/pause button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrent) {
                          togglePlay();
                        } else {
                          playTrack(originalIndex);
                        }
                      }}
                      className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
                        isItemPlaying
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                          : 'bg-white/5 hover:bg-red-600 text-slate-300 hover:text-white border border-white/10'
                      }`}
                      title={isItemPlaying ? 'Pausar' : 'Ouvir esta música'}
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
