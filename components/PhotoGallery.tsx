
import React, { useState, useEffect } from 'react';

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
      estudio: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop",
      eventos: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
      lugares: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=800&auto=format&fit=crop"
    };
    e.currentTarget.src = fallbackImages[photo.category];
    setHasError(true);
  };

  return (
    <div 
      onClick={() => isLoaded && onClick(photo)}
      className="group relative h-64 md:h-80 rounded-[2rem] overflow-hidden cursor-pointer border border-white/5 bg-gray-800 shadow-xl transition-all duration-500 hover:-translate-y-2"
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] opacity-50" />
        </div>
      )}
      <img 
        src={photo.url} 
        alt={`${photo.title} - Web Rádio Figueiró ${photo.category}`} 
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
        className={`w-full h-full object-cover transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'} group-hover:scale-110`}
        loading="lazy"
      />
      <div className={`absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent flex flex-col justify-end p-6 transition-opacity duration-500 ${isLoaded ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
        <span className="inline-block w-fit px-2 py-0.5 rounded-md bg-blue-600 text-[8px] font-black uppercase tracking-widest text-white mb-2">
          {photo.category}
        </span>
        <h4 className="text-white font-black text-lg tracking-tighter leading-tight">{photo.title}</h4>
      </div>
    </div>
  );
};

const PhotoGallery: React.FC = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'eventos' | 'lugares' | 'estudio'>('todos');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const FOTOS_ESTUDIO: Photo[] = [
    { id: 1, url: "https://i.ibb.co/CsszM3Kd/estudio-1.png", title: "Estúdio Principal", category: "estudio", description: "Onde a magia da rádio acontece em direto." },
    { id: 2, url: "https://i.ibb.co/wNdZrQsq/estudio-7.png", title: "Produção Criativa", category: "estudio", description: "Preparando os melhores conteúdos para os nossos ouvintes." },
    { id: 3, url: "https://i.ibb.co/hxpKn39j/estudio-8.png", title: "Mesa de Controlo", category: "estudio", description: "Qualidade de som digital de última geração." },
    { id: 4, url: "https://i.ibb.co/XfPnKXJG/estudio-9.png", title: "Emissão em Direto", category: "estudio", description: "A sua melhor companhia, 24 horas por dia." },
    { id: 5, url: "https://i.ibb.co/VpxWwRL5/estudio-11.png", title: "Ambiente WRF", category: "estudio", description: "O conforto e a tecnologia ao serviço da comunicação." }
  ];

  const FOTOS_EVENTOS: Photo[] = [
    { id: 6, url: "https://i.ibb.co/FLy3fcbD/evento-8.png", title: "Grandes Eventos", category: "eventos", description: "Momentos de celebração com toda a equipa." },
    { id: 7, url: "https://i.ibb.co/My2GBFkV/evento-5.png", title: "Animação Constante", category: "eventos", description: "Levamos a alegria da rádio a todo o lado." },
    { id: 8, url: "https://i.ibb.co/6cTdKw76/evento-4.png", title: "Encontros de Ouvintes", category: "eventos", description: "A nossa rádio é feita de pessoas para pessoas." },
    { id: 9, url: "https://i.ibb.co/qFWkDj7R/evento-3.png", title: "Festas da Região", category: "eventos", description: "Apoio constante às tradições da nossa terra." },
    { id: 10, url: "https://i.ibb.co/r2V3H4XB/evento-2.png", title: "Destaques Culturais", category: "eventos", description: "Sempre presentes onde a cultura acontece." }
  ];

  const FOTOS_LUGARES: Photo[] = [
    { id: 11, url: "https://i.ibb.co/7JkwB7cB/Foto-Igreja-Figueiro.png", title: "Paisagens de Figueiró", category: "lugares", description: "A beleza natural que nos rodeia e inspira." },
    { id: 12, url: "https://i.ibb.co/Q4Wcgtn/lugar-4.png", title: "Património e História", category: "lugares", description: "Orgulho nas nossas raízes e na nossa história." },
    { id: 13, url: "https://i.ibb.co/S7Wmhp4G/Foto-Junta-Figueiro.png", title: "Recantos da Nossa Terra", category: "lugares", description: "Figueiró em todo o seu esplendor." },
    { id: 14, url: "https://i.ibb.co/HTByF1mN/lugar-6.png", title: "Vistas Panorâmicas", category: "lugares", description: "O horizonte que abraça a Web Rádio Figueiró." },
    { id: 15, url: "https://i.ibb.co/cXxgm9jb/lugar-7.png", title: "Tradição Local", category: "lugares", description: "Onde o passado e o presente se encontram." }
  ];

  const allPhotos: Photo[] = [...FOTOS_ESTUDIO, ...FOTOS_EVENTOS, ...FOTOS_LUGARES];
  const filteredPhotos = filter === 'todos' ? allPhotos : allPhotos.filter(p => p.category === filter);

  const handleCloseGallery = () => {
    setIsOverlayOpen(false);
    setSelectedPhoto(null);
    // Se fecharmos manualmente e houver o estado no histórico, limpamo-lo
    if (window.history.state?.galleryOpen) {
      window.history.back();
    }
  };

  const handleOpenGallery = () => {
    window.dispatchEvent(new CustomEvent('close-overlays'));
    setIsOverlayOpen(true);
  };

  // Lógica para sincronizar com o histórico do browser e fechar com ESC
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
      // Adiciona um estado ao histórico para que o botão "back" feche a galeria
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
  }, [isOverlayOpen, selectedPhoto]);

  return (
    <div className="w-full">
      <div 
        onClick={handleOpenGallery}
        className="glass-card glass-card-interactive group relative w-full h-64 md:h-72 rounded-[2rem] overflow-hidden cursor-pointer"
      >
        <img 
          src={FOTOS_ESTUDIO[0].url} 
          alt="Explorar Galeria de Fotos Web Rádio Figueiró Amarante" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-[#07090e] via-[#07090e]/60 to-transparent">
          <div className="mb-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 group-hover:scale-110 transition-transform duration-300 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <span className="text-red-400 font-black uppercase tracking-[0.25em] text-[9px] mb-1">Bastidores & Eventos</span>
          <h3 className="text-2xl md:text-3xl font-brand font-bold text-white tracking-tight mb-2">Galeria de Fotos</h3>
          <p className="text-slate-300 text-xs mb-4">Explore os momentos e recantos da nossa emissão</p>
          
          <div className="flex items-center space-x-2">
            <span className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-red-600/30 transition-colors">
              Ver {allPhotos.length} Fotos
            </span>
          </div>
        </div>
      </div>

      {isOverlayOpen && (
        <div className="fixed inset-0 z-[300] bg-[#07090e]/95 backdrop-blur-3xl flex flex-col animate-in fade-in duration-300 text-white">
          <div className="sticky top-0 z-20 bg-[#07090e]/90 backdrop-blur-2xl border-b border-white/[0.08]">
            <div className="container mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2.5 bg-red-600/20 border border-red-500/30 rounded-xl text-red-500">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-[9px] text-red-400 font-black uppercase tracking-[0.25em] block">
                    Figueiró • Amarante
                  </span>
                  <h2 className="text-lg sm:text-2xl font-brand font-black text-white tracking-tight leading-none mt-0.5">
                    Galeria de Fotografias
                  </h2>
                </div>
              </div>

              {/* Botão de Fechar */}
              <button 
                onClick={handleCloseGallery}
                className="flex items-center space-x-2 px-4 sm:px-5 py-2.5 bg-white/5 hover:bg-red-600 text-white rounded-xl border border-white/10 transition-all text-[10px] font-black uppercase tracking-wider"
                aria-label="Fechar Galeria"
              >
                <span className="hidden sm:inline">Fechar Galeria</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="container mx-auto px-4 sm:px-6 pb-3">
              <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide py-1">
                {[
                  { id: 'todos', label: 'Todas' },
                  { id: 'estudio', label: 'Estúdio' },
                  { id: 'eventos', label: 'Eventos' },
                  { id: 'lugares', label: 'Lugares' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id as 'todos' | 'eventos' | 'lugares' | 'estudio')}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                      filter === cat.id 
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
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
              
              <div className="mt-12 mb-16 text-center py-8 border-t border-white/[0.08]">
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em]">
                  Web Rádio Figueiró - Sintonizados na Comunidade
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[310] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-6xl w-full flex flex-col items-center animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="relative group w-full bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
              <img 
                src={selectedPhoto.url} 
                alt={`${selectedPhoto.title} - Ampliada`}
                className="max-h-[75vh] md:max-h-[85vh] w-full object-contain"
              />
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-red-600 backdrop-blur-md text-white rounded-full transition-all border border-white/10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="mt-8 text-center max-w-2xl px-4">
              <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-3 block">
                {selectedPhoto.category}
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-tight">{selectedPhoto.title}</h2>
              <p className="text-gray-400 mt-3 text-sm md:text-lg leading-relaxed">{selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default PhotoGallery;
