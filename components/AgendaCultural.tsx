import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { fetchCulturalEvents } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { MEDIA_ASSETS } from '../src/mediaAssets';

interface CulturalEvent {
  title: string;
  dateStr: string;
  day: string;
  month: string;
  location: string;
  category: string;
  image: string;
  sourceUrl: string;
}

const AgendaCultural: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useLanguage();
  const [events, setEvents] = useState<CulturalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fallbackImages: Record<string, string> = {
    CONCERTO: MEDIA_ASSETS.culturalEventsStage,
    'EXPOSIÇÃO': MEDIA_ASSETS.tamegaHeritageBanner,
    TEATRO: MEDIA_ASSETS.culturalEventsStage,
    FESTA: MEDIA_ASSETS.newsFallbackCommunity,
    GERAL: MEDIA_ASSETS.tamegaHeritageBanner,
  };

  const loadEvents = async () => {
    setLoading(true);
    setHasError(false);

    try {
      const result = await fetchCulturalEvents();

      if (!result || !result.text || !result.text.includes('EVENTO_START')) {
        setHasError(true);
        return;
      }

      const eventBlocks = result.text.match(/EVENTO_START[\s\S]*?EVENTO_END/g);
      if (!eventBlocks || eventBlocks.length === 0) {
        setHasError(true);
        return;
      }

      const parsed = eventBlocks.map((block) => {
        const extract = (key: string) => {
          const regex = new RegExp(`${key}:\\s*(.*)`, 'i');
          const match = block.match(regex);
          return match ? match[1].trim().replace(/[*`]/g, '') : '';
        };

        const title = extract('TITULO');
        const dateStr = extract('DATA');
        const local = extract('LOCAL');
        const type = extract('TIPO').toUpperCase() || 'GERAL';
        const img = extract('IMAGEM');
        const link = extract('LINK');

        const dayMatch = dateStr.match(/\d+/);
        const day = dayMatch ? dayMatch[0] : '—';
        const monthPart = dateStr
          .replace(day, '')
          .replace(/\bde\b/gi, '')
          .replace(/[·,]/g, '')
          .trim()
          .substring(0, 3)
          .toUpperCase();

        const validImg =
          img && img.startsWith('http') && !img.includes('unsplash.com')
            ? img
            : fallbackImages[type] || fallbackImages.GERAL;

        return {
          title: title || 'Evento Cultural',
          dateStr,
          day,
          month: monthPart || 'AGENDA',
          location: local || 'Amarante',
          category: type,
          image: validImg,
          sourceUrl: link || 'https://www.cm-amarante.pt',
        };
      });

      setEvents(parsed);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleCloseOverlays = (e: Event) => {
      const detail = (e as CustomEvent<{ source?: string }>).detail;
      if (detail?.source !== 'agenda') {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('close-overlays', handleCloseOverlays);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('close-overlays', handleCloseOverlays);
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.agenda.title}
      className="fixed inset-0 z-[500] bg-slate-50/95 dark:bg-[#07090e]/95 backdrop-blur-2xl overflow-y-auto text-slate-900 dark:text-white transition-colors"
    >
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.08]">
        <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-red-600 dark:text-red-400 font-bold uppercase tracking-[0.2em] block">
              {t.agenda.kicker}
            </span>
            <h2 className="text-lg sm:text-2xl font-brand font-black tracking-tight text-slate-900 dark:text-white leading-none mt-0.5">
              {t.agenda.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-red-600 hover:text-white text-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-white/10 transition-colors text-xs font-bold uppercase tracking-wider shrink-0"
          >
            <span className="hidden sm:inline">{t.agenda.close}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-6 text-slate-600 dark:text-slate-300 font-semibold text-sm">
              {t.agenda.tuning}
            </p>
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto glass-card p-8">
            <h3 className="text-xl font-brand font-black text-slate-900 dark:text-white mb-2">
              {t.agenda.unavailableTitle}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              {t.agenda.unavailableDesc}
            </p>
            <button
              type="button"
              onClick={loadEvents}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
            >
              {t.agenda.reload}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div key={index} className="glass-card glass-card-interactive overflow-hidden flex flex-col group">
                <div className="relative h-56 overflow-hidden bg-slate-200 dark:bg-slate-900">
                  <img
                    src={event.image}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={event.title}
                    onError={(e) => {
                      e.currentTarget.src = fallbackImages[event.category] || fallbackImages.GERAL;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                  <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md rounded-xl px-3 py-2 text-center border border-white/15 tabular-nums">
                    <p className="text-[10px] font-bold text-red-400 uppercase leading-none mb-1">{event.month}</p>
                    <p className="text-xl font-brand font-black leading-none text-white">{event.day}</p>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1.5 block">
                    {event.category}
                  </span>
                  <h3 className="text-slate-900 dark:text-white font-brand font-bold text-lg leading-snug mb-3 line-clamp-2">
                    {event.title}
                  </h3>

                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-6 truncate">
                    {event.location}
                  </p>

                  <a
                    href={event.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-colors"
                  >
                    {t.agenda.viewDetails}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-14 text-center py-6 border-t border-slate-200 dark:border-white/[0.08]">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.agenda.footer}</p>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
};

export default AgendaCultural;
