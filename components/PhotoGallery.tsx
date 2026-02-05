
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

  useEffect(() => {
    if (isOverlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOverlayOpen]);

  return (
    <div className="w-full">
      <div 
        onClick={() => setIsOverlayOpen(true)}
        className="group relative w-full h-64 md:h-80 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-700 hover:scale-[1.02] border border-blue-500/20"
      >
        <div className="absolute inset-0 bg-blue-900/40 group-hover:bg-blue-900/20 transition-colors z-10" />
        <img 
          src={FOTOS_ESTUDIO[0].url} 
          alt="Explorar Galeria de Fotos Web Rádio Figueiró Amarante" 
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
        />
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent">
          <div className="mb-4 p-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 group-hover:scale-110 transition-transform duration-500">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2">A Nossa Galeria</h3>
          <p className="text-blue-300 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">Explore o estúdio e os nossos eventos</p>
          
          <div className="flex items-center space-x-4">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/40">
              Ver {allPhotos.length} Fotos
            </span>
          </div>
        </div>
      </div>

      {isOverlayOpen && (
        <div className="fixed inset-0 z-[120] bg-gray-950 flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-xl border-b border-white/5">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">Galeria Web Rádio Figueiró</h2>
              </div>
              <button 
                onClick={() => setIsOverlayOpen(false)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="container mx-auto px-4 pb-4">
              <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide py-2">
                {[
                  { id: 'todos', label: 'Todas' },
                  { id: 'estudio', label: 'Estúdio' },
                  { id: 'eventos', label: 'Eventos' },
                  { id: 'lugares', label: 'Lugares' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id as any)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                      filter === cat.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105' 
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-4 md:p-8 bg-gray-950">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPhotos.map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} onClick={setSelectedPhoto} />
                ))}
              </div>
              
              <div className="mt-12 mb-20 text-center py-12 border-t border-white/5">
                <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em]">
                  Web Rádio Figueiró - A Sua Melhor Companhia
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[130] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-5xl w-full flex flex-col items-center animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="relative group w-full bg-gray-900 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
              <img 
                src={selectedPhoto.url} 
                alt={`${selectedPhoto.title} - Ampliada`}
                className="max-h-[70vh] md:max-h-[80vh] w-full object-contain"
              />
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-red-600 text-white rounded-full transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="mt-6 text-center">
              <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[9px] mb-2 block">
                {selectedPhoto.category}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter">{selectedPhoto.title}</h2>
              <p className="text-gray-400 mt-2 text-sm md:text-base max-w-xl mx-auto">{selectedPhoto.description}</p>
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
