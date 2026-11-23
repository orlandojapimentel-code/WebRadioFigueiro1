import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { RADIO_LOGO } from '../src/constants';
import { MEDIA_ASSETS } from '../src/mediaAssets';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<string>(t.player.tuning);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setNowPlaying((prev) => (prev.endsWith('...') ? t.player.tuning : prev));
  }, [t.player.tuning]);

  useEffect(() => {
    const handleRadioState = (e: Event) => {
      const customEvent = e as CustomEvent<{ isPlaying?: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.isPlaying === 'boolean') {
        setIsPlaying(customEvent.detail.isPlaying);
      }
    };
    const handleNowPlaying = (e: Event) => {
      const customEvent = e as CustomEvent<{ song?: string }>;
      if (customEvent.detail?.song) {
        setNowPlaying(customEvent.detail.song);
      }
    };

    window.addEventListener('wrf-radio-state', handleRadioState);
    window.addEventListener('wrf-now-playing', handleNowPlaying);
    return () => {
      window.removeEventListener('wrf-radio-state', handleRadioState);
      window.removeEventListener('wrf-now-playing', handleNowPlaying);
    };
  }, []);

  const handlePlayClick = () => {
    window.dispatchEvent(new CustomEvent('wrf-toggle-play'));
  };

  const scrollToPlaylist = () => {
    window.dispatchEvent(new CustomEvent('wrf-set-media-tab', { detail: { tab: 'playlist' } }));
    const el = document.getElementById('multimedia');
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 112;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="glass-card overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Editorial Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
              {t.hero.kicker}
            </p>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-brand font-black tracking-tight leading-[1.06] text-slate-900 dark:text-white text-balance">
              {t.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              {t.hero.description}{' '}
              <span className="text-slate-900 dark:text-white font-semibold">{t.hero.since}</span>.
            </p>
          </div>

          {/* Live Now Playing Strip */}
          <div className="rounded-2xl bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0 flex items-center gap-3">
              <div className="flex items-end gap-0.5 h-4 shrink-0" aria-hidden="true">
                {[0.6, 1, 0.45, 0.85].map((scale, idx) => (
                  <span
                    key={idx}
                    className={`w-1 rounded-full bg-red-600 dark:bg-red-500 ${
                      isPlaying ? 'animate-eq-bar h-4' : 'h-1.5 opacity-40'
                    }`}
                    style={
                      isPlaying
                        ? { animationDelay: `${idx * 0.14}s`, transform: `scaleY(${scale})` }
                        : undefined
                    }
                  />
                ))}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  {t.hero.nowPlayingLabel}
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {nowPlaying}
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0 tabular-nums">
              320 kbps
            </span>
          </div>

          {/* Actions & Station Metadata */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handlePlayClick}
                className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 shadow-md ${
                  isPlaying
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
                }`}
              >
                {isPlaying ? (
                  <>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                    <span>{t.hero.pauseCta}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>{t.hero.cta}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={scrollToPlaylist}
                className="px-5 py-3.5 rounded-2xl border border-slate-300 dark:border-white/15 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors whitespace-nowrap shrink-0"
              >
                {t.media.tabs.playlist}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-slate-200 dark:border-white/[0.08]">
              <div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                  {t.hero.qualityLabel}
                </span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  320 kbps HD
                </span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                  {t.hero.originLabel}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">
                  {t.hero.originValue}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                  {t.hero.broadcastLabel}
                </span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {t.hero.broadcastValue}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Studio Visual Column */}
        <div
          onClick={handlePlayClick}
          className="lg:col-span-5 relative min-h-[260px] sm:min-h-[340px] lg:h-full cursor-pointer group overflow-hidden bg-slate-900"
        >
          <img
            src={MEDIA_ASSETS.heroStudioAmarante}
            alt="Estúdio da Web Rádio Figueiró com vista para o Vale do Tâmega"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/15" />

          <div className="absolute inset-x-6 bottom-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-black/75 border border-white/20 p-1.5 flex items-center justify-center shrink-0">
                {!logoError ? (
                  <img
                    src={RADIO_LOGO}
                    alt="Logótipo Web Rádio Figueiró"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain rounded-lg"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="text-red-500 font-brand font-black text-xs">WRF</span>
                )}
              </div>
              <div className="min-w-0 text-white">
                <p className="text-sm font-brand font-bold truncate">Web Rádio Figueiró</p>
                <p className="text-xs text-slate-300 truncate">{t.hero.subtitle}</p>
              </div>
            </div>

            <div className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
              {isPlaying ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
