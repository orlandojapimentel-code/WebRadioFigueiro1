
import React, { useState } from 'react';

interface Photo {
  id: number;
  url: string;
  title: string;
  category: 'eventos' | 'lugares' | 'estudio';
  description: string;
}

const PhotoGallery: React.FC = () => {
  const [filter, setFilter] = useState<'todos' | 'eventos' | 'lugares' | 'estudio'>('todos');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // --- CONFIGURAÇÃO DAS FOTOS ---
  // Atualizado para .png conforme os ficheiros no seu GitHub
  
  const FOTOS_EVENTOS: Photo[] = [
    {
      id: 101,
      url: "images/eventos/evento_1.png", 
      title: "Evento na Praça",
      category: "eventos",
      description: "Momento de convívio com os nossos ouvintes."
    },
    {
      id: 102,
      url: "images/eventos/evento_2.png",
      title: "Aniversário da Rádio",
      category: "eventos",
      description: "Celebração especial nos nossos estúdios."
    }
  ];

  const FOTOS_LUGARES: Photo[] = [
    {
      id: 201,
      url: "images/lugares/lugar_1.png",
      title: "Vistas de Figueiró",
      category: "lugares",
      description: "A beleza natural que nos rodeia todos os dias."
    }
  ];

  const FOTOS_ESTUDIO: Photo[] = [
    {
      id: 301,
      url: "images/estudio/estudio_1.png",
      title: "Estúdio Principal",
      category: "estudio",
      description: "Onde a magia da rádio acontece em direto."
    }
  ];

  const allPhotos: Photo[] = [...FOTOS_EVENTOS, ...FOTOS_LUGARES, ...FOTOS_ESTUDIO];
  const filteredPhotos = filter === 'todos' ? allPhotos : allPhotos.filter(p => p.category === filter);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Se a foto não existir, mostra uma imagem de reserva (stock)
    e.currentTarget.src = "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop"; 
  };

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
            <h3 className="text-3xl font-black text-white tracking-tight">Galeria Fotográfica</h3>
            <p className="text-xs text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Nossa Terra, Nossa Gente</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 bg-gray-950/50 p-1.5 rounded-2xl border border-white/5">
          {[
            { id: 'todos', label: 'Ver Todas' },
            { id: 'eventos', label: 'Eventos' },
            { id: 'lugares', label: 'Lugares' },
            { id: 'estudio', label: 'Estúdio' }
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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPhotos.map((photo) => (
          <div 
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative h-80 rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5 bg-gray-800 shadow-xl transition-all duration-500"
          >
            <img 
              src={photo.url} 
              alt={photo.title}
              onError={handleImageError}
              className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
              <span className="inline-block w-fit px-3 py-1 rounded-lg bg-blue-600 text-[9px] font-black uppercase tracking-widest text-white mb-3">
                {photo.category}
              </span>
              <h4 className="text-white font-black text-2xl tracking-tighter mb-2">{photo.title}</h4>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{photo.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[110] bg-gray-950/98 backdrop-blur-2xl flex items-center justify-center p-6"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-5xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img 
              src={selectedPhoto.url} 
              alt={selectedPhoto.title}
              onError={handleImageError}
              className="rounded-[2.5rem] shadow-2xl max-h-[70vh] object-contain border border-white/10"
            />
            <div className="mt-8 text-center">
              <h2 className="text-4xl font-black text-white tracking-tighter">{selectedPhoto.title}</h2>
              <p className="text-gray-400 mt-2 text-lg">{selectedPhoto.description}</p>
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="mt-6 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Fechar Galeria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
