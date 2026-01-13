
import React, { useState } from 'react';

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
      className="group relative h-80 rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5 bg-gray-800 shadow-xl transition-all duration-500 hover:-translate-y-2"
    >
      {/* Skeleton / Shimmer Effect */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] opacity-50" />
          <div className="absolute flex flex-col items-center">
             <svg className="w-8 h-8 text-gray-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
             </svg>
          </div>
        </div>
      )}

      {/* A Imagem Real */}
      <img 
        src={photo.url} 
        alt={photo.title}
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
        className={`w-full h-full object-cover transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'} group-hover:scale-110`}
        loading="lazy"
      />

      {/* Overlay de Informação (Só aparece se a imagem estiver carregada) */}
      <div className={`absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent flex flex-col justify-end p-8 transition-opacity duration-500 ${isLoaded ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
        <span className="inline-block w-fit px-3 py-1 rounded-lg bg-blue-600 text-[9px] font-black uppercase tracking-widest text-white mb-3">
          {photo.category}
        </span>
        <h4 className="text-white font-black text-2xl tracking-tighter mb-2">{photo.title}</h4>
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{photo.description}</p>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

const PhotoGallery: React.FC = () => {
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
    { id: 11, url: "https://i.ibb.co/RJvXjGz/lugar-2.png", title: "Paisagens de Figueiró", category: "lugares", description: "A beleza natural que nos rodeia e inspira." },
    { id: 12, url: "https://i.ibb.co/Q4Wcgtn/lugar-4.png", title: "Património e História", category: "lugares", description: "Orgulho nas nossas raízes e na nossa história." },
    { id: 13, url: "https://i.ibb.co/k2MdNkgW/lugar-5.png", title: "Recantos da Nossa Terra", category: "lugares", description: "Figueiró em todo o seu esplendor." },
    { id: 14, url: "https://i.ibb.co/HTByF1mN/lugar-6.png", title: "Vistas Panorâmicas", category: "lugares", description: "O horizonte que abraça a Web Rádio Figueiró." },
    { id: 15, url: "https://i.ibb.co/cXxgm9jb/lugar-7.png", title: "Tradição Local", category: "lugares", description: "Onde o passado e o presente se encontram." }
  ];

  const allPhotos: Photo[] = [...FOTOS_ESTUDIO, ...FOTOS_EVENTOS, ...FOTOS_LUGARES];
  const filteredPhotos = filter === 'todos' ? allPhotos : allPhotos.filter(p => p.category === filter);

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-800 pb-8">
        <div className="flex items-center space-x-5">
          <div className="p-4 bg-blue-600 rounded-[1.5rem] shadow-lg shadow-blue-500/20">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-3xl font-black text-white tracking-tight">A Nossa Galeria</h3>
            <p className="text-xs text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Imagens Reais da Web Rádio Figueiró</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 bg-gray-950/50 p-1.5 rounded-2xl border border-white/5">
          {[
            { id: 'todos', label: 'Ver Todas' },
            { id: 'estudio', label: 'Estúdio' },
            { id: 'eventos', label: 'Eventos' },
            { id: 'lugares', label: 'Lugares' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === cat.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPhotos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} onClick={setSelectedPhoto} />
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[110] bg-gray-950/98 backdrop-blur-2xl flex items-center justify-center p-6"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-5xl w-full flex flex-col items-center animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="relative group w-full bg-gray-900 rounded-[2.5rem] overflow-hidden">
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.title}
                className="rounded-[2.5rem] shadow-2xl max-h-[75vh] w-full object-contain border border-white/10"
              />
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-6 right-6 p-4 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="mt-8 text-center max-w-2xl">
              <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">
                {selectedPhoto.category}
              </span>
              <h2 className="text-4xl font-black text-white tracking-tighter">{selectedPhoto.title}</h2>
              <p className="text-gray-400 mt-3 text-lg leading-relaxed">{selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fixing missing default export
export default PhotoGallery;
