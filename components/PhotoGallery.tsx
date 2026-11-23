import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { MEDIA_ASSETS } from '../src/mediaAssets';

interface Photo {
  id: number;
  url: string;
  title: string;
  category: 'eventos' | 'lugares' | 'estudio';
  description: string;
}

const PhotoCard: React.FC<{ photo: Photo; onClick: (p: Photo) => void }> = ({ photo, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const fallbackImages = {
      estudio: MEDIA_ASSETS.heroStudioAmarante,
      eventos: MEDIA_ASSETS.culturalEventsStage,
      lugares: MEDIA_ASSETS.tamegaHeritageBanner,
    };
    e.currentTarget.src = fallbackImages[photo.category];
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      onClick={() => onClick(photo)}
      className="group relative h-60 sm:h-64 rounded-2xl overflow-hidden cursor-pointer border border-slate-200 dark:border-white/10 bg-slate-200 dark:bg-slate-900 shadow-md transition-transform duration-300 hover:-translate-y-1"
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
      )}
      <img
        src={photo.url}
        alt={`${photo.title} - Web Rádio Figueiró ${photo.category}`}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } group-hover:scale-105`}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-5 opacity-90 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1">
          {photo.category}
        </span>
        <h4 className="text-white font-brand font-bold text-base leading-tight">{photo.title}</h4>
      </div>
    </div>
  );
};

const PhotoGallery: React.FC = () => {
  const { t } = useLanguage();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'eventos' | 'lugares' | 'estudio'>('todos');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const FOTOS_ESTUDIO: Photo[] = [
    { id: 1, url: 'https://i.ibb.co/CsszM3Kd/estudio-1.png', title: 'Estúdio Principal', category: 'estudio', description: 'Onde a magia da rádio acontece em direto.' },
    { id: 2, url: 'https://i.ibb.co/wNdZrQsq/estudio-7.png', title: 'Produção Criativa', category: 'estudio', description: 'Preparando os melhores conteúdos para os nossos ouvintes.' },
    { id: 3, url: 'https://i.ibb.co/hxpKn39j/estudio-8.png', title: 'Mesa de Controlo', category: 'estudio', description: 'Qualidade de som digital de última geração.' },
    { id: 4, url: 'https://i.ibb.co/XfPnKXJG/estudio-9.png', title: 'Emissão em Direto', category: 'estudio', description: 'A sua melhor companhia, 24 horas por dia.' },
    { id: 5, url: 'https://i.ibb.co/VpxWwRL5/estudio-11.png', title: 'Ambiente WRF', category: 'estudio', description: 'O conforto e a tecnologia ao serviço da comunicação.' },
  ];

  const FOTOS_EVENTOS: Photo[] = [
    { id: 6, url: 'https://i.ibb.co/FLy3fcbD/evento-8.png', title: 'Grandes Eventos', category: 'eventos', description: 'Momentos de celebração com toda a equipa.' },
    { id: 7, url: 'https://i.ibb.co/My2GBFkV/evento-5.png', title: 'Animação Constante', category: 'eventos', description: 'Levamos a alegria da rádio a todo o lado.' },
    { id: 8, url: 'https://i.ibb.co/6cTdKw76/evento-4.png', title: 'Encontros de Ouvintes', category: 'eventos', description: 'A nossa rádio é feita de pessoas para pessoas.' },
    { id: 9, url: 'https://i.ibb.co/qFWkDj7R/evento-3.png', title: 'Festas da Região', category: 'eventos', description: 'Apoio constante às tradições da nossa terra.' },
    { id: 10, url: 'https://i.ibb.co/r2V3H4XB/evento-2.png', title: 'Destaques Culturais', category: 'eventos', description: 'Sempre presentes onde a cultura acontece.' },
  ];

  const FOTOS_LUGARES: Photo[] = [
    { id: 11, url: 'https://i.ibb.co/7JkwB7cB/Foto-Igreja-Figueiro.png', title: 'Paisagens de Figueiró', category: 'lugares', description: 'A beleza natural que nos rodeia e inspira.' },
    { id: 12, url: 'https://i.ibb.co/Q4Wcgtn/lugar-4.png', title: 'Património e História', category: 'lugares', description: 'Orgulho nas nossas raízes e na nossa história.' },
    { id: 13, url: 'https://i.ibb.co/S7Wmhp4G/Foto-Junta-Figueiro.png', title: 'Recantos da Nossa Terra', category: 'lugares', description: 'Figueiró em todo o seu esplendor.' },
    { id: 14, url: 'https://i.ibb.co/HTByF1mN/lugar-6.png', title: 'Vistas Panorâmicas', category: 'lugares', description: 'O horizonte que abraça a Web Rádio Figueiró.' },
    { id: 15, url: 'https://i.ibb.co/cXxgm9jb/lugar-7.png', title: 'Tradição Local', category: 'lugares', description: 'Onde o passado e o presente se encontram.' },
  ];

  const allPhotos: Photo[] = [...FOTOS_ESTUDIO, ...FOTOS_EVENTOS, ...FOTOS_LUGARES];
  const filteredPhotos = filter === 'todos' ? allPhotos : allPhotos.filter((p) => p.category === filter);

  const handleCloseGallery = () => {
    setIsOverlayOpen(false);
    setSelectedPhoto(null);
    if (window.history.state?.galleryOpen) {
      window.history.back();
    }
  };

  const handleOpenGallery = () => {
    window.dispatchEvent(new CustomEvent('close-overlays'));
    setIsOverlayOpen(true);
  };

  useEffect(() => {
    const handlePopState = () => {
      if (isOverlayOpen) {
        setIsOverlayOpen(false);
        setSelectedPhoto(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPhoto) {
          setSelectedPhoto(null);
        } else if (isOverlayOpen) {
          handleCloseGallery();
        }
      }
    };

    if (isOverlayOpen) {
      const handleCloseOverlays = () => handleCloseGallery();
      window.addEventListener('close-overlays', handleCloseOverlays);

      document.body.style.overflow = 'hidden';
      window.history.pushState({ galleryOpen: true }, '');
      window.addEventListener('popstate', handlePopState);
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('close-overlays', handleCloseOverlays);
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOverlayOpen, selectedPhoto]);

  return (
    <div className="w-full">
      <div
        onClick={handleOpenGallery}
        className="group relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden cursor-pointer border border-slate-200 dark:border-white/10 bg-slate-900"
      >
        <img
          src={FOTOS_ESTUDIO[0].url}
          alt="Explorar Galeria de Fotos Web Rádio Figueiró Amarante"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = MEDIA_ASSETS.tamegaHeritageBanner;
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 bg-gradient-to-t from-black/85 via-black/45 to-black/15">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-red-400 font-bold uppercase tracking-[0.2em] text-[11px] block mb-1">
                {t.gallery.kicker}
              </span>
              <h4 className="text-xl sm:text-2xl font-brand font-bold text-white">
                {t.gallery.cardTitle}
              </h4>
              <p className="text-slate-200 text-xs sm:text-sm mt-1">{t.gallery.cardDesc}</p>
            </div>

            <span className="self-start sm:self-auto bg-red-600 group-hover:bg-red-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0">
              {t.gallery.viewPhotos} ({allPhotos.length})
            </span>
          </div>
        </div>
      </div>

      {isOverlayOpen && (
        <div className="fixed inset-0 z-[300] bg-slate-50/95 dark:bg-[#07090e]/95 backdrop-blur-2xl flex flex-col text-slate-900 dark:text-white">
          <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#07090e]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.08]">
            <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-red-600 dark:text-red-400 font-bold uppercase tracking-[0.2em] block">
                  {t.hero.originValue}
                </span>
                <h2 className="text-lg sm:text-2xl font-brand font-black text-slate-900 dark:text-white tracking-tight leading-none mt-0.5">
                  {t.gallery.modalTitle}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleCloseGallery}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-red-600 hover:text-white text-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-white/10 transition-colors text-xs font-bold uppercase tracking-wider"
                aria-label={t.gallery.close}
              >
                <span className="hidden sm:inline">{t.gallery.close}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="container mx-auto px-4 sm:px-6 pb-3">
              <div className="inline-flex bg-slate-100 dark:bg-white/[0.05] p-1 rounded-xl border border-slate-200 dark:border-white/10 gap-1 overflow-x-auto max-w-full">
                {[
                  { id: 'todos', label: t.gallery.all },
                  { id: 'estudio', label: t.gallery.studio },
                  { id: 'eventos', label: t.gallery.events },
                  { id: 'lugares', label: t.gallery.places },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFilter(cat.id as 'todos' | 'eventos' | 'lugares' | 'estudio')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                      filter === cat.id
                        ? 'bg-slate-900 dark:bg-red-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-4 sm:p-6 md:p-8">
            <div className="container mx-auto max-w-7xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredPhotos.map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} onClick={setSelectedPhoto} />
                ))}
              </div>

              <div className="mt-12 mb-10 text-center py-6 border-t border-slate-200 dark:border-white/[0.08]">
                <p className="text-slate-500 dark:text-slate-400 font-medium text-xs">
                  {t.gallery.modalFooter}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[310] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="max-w-5xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={selectedPhoto.url}
                alt={`${selectedPhoto.title} - Ampliada`}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = MEDIA_ASSETS.tamegaHeritageBanner;
                }}
                className="max-h-[75vh] w-full object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-3 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors border border-white/15"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-6 text-center max-w-xl px-4">
              <span className="text-red-400 font-bold uppercase tracking-[0.25em] text-xs mb-2 block">
                {selectedPhoto.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-brand font-bold text-white">{selectedPhoto.title}</h2>
              <p className="text-slate-300 mt-2 text-sm sm:text-base">{selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
