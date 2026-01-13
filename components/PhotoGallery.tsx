
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

  // --- CONFIGURAÇÃO DAS FOTOS COM LINKS PERMANENTES ---
  // Estas imagens são profissionais e nunca desaparecem do site.
  
  const FOTOS_EVENTOS: Photo[] = [
    {
      id: 101,
      url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop", 
      title: "Eventos na Comunidade",
      category: "eventos",
      description: "A Web Rádio Figueiró presente nos momentos mais importantes da nossa região."
    },
    {
      id: 102,
      url: "https://images.unsplash.com/photo-1514525253344-7814d9196606?q=80&w=1200&auto=format&fit=crop",
      title: "Festas Populares",
      category: "eventos",
      description: "Cobertura em direto das tradições que unem o nosso povo."
    }
  ];

  const FOTOS_LUGARES: Photo[] = [
    {
      id: 201,
      url: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=1200&auto=format&fit=crop",
      title: "Encantos de Figueiró",
      category: "lugares",
      description: "As paisagens deslumbrantes que servem de cenário à nossa emissão."
    },
    {
      id: 202,
      url: "https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=1200&auto=format&fit=crop",
      title: "Recantos de Amarante",
      category: "lugares",
      description: "A nossa terra, a nossa inspiração diária."
    }
  ];

  const FOTOS_ESTUDIO: Photo[] = [
    {
      id: 301,
      url: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop",
      title: "Estúdio Principal",
      category: "estudio",
      description: "Tecnologia de ponta para levar o melhor som até si."
    },
    {
      id: 302,
      url: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1200&auto=format&fit=crop",
      title: "A Magia do Direto",
      category: "estudio",
      description: "Onde as vozes da rádio ganham vida e companhia."
    }
  ];

  const allPhotos: Photo[] = [...FOTOS_EVENTOS, ...FOTOS_LUGARES, ...FOTOS_ESTUDIO];
  const filteredPhotos = filter === 'todos' ? allPhotos : allPhotos.filter(p => p.category === filter);

  return (
    <div className="space-y-8">
      {/* Cabeçalho da Galeria */}
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

        {/* Filtros Estilizados */}
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

      {/* Grid de Fotos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPhotos.map((photo) => (
          <div 
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative h-80 rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5 bg-gray-800 shadow-xl transition-all duration-500 hover:-translate-y-2"
          >
            <img 
              src={photo.url} 
              alt={photo.title}
              className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
              loading="lazy"
            />
            {/* Overlay com Informação */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
              <span className="inline-block w-fit px-3 py-1 rounded-lg bg-blue-600 text-[9px] font-black uppercase tracking-widest text-white mb-3">
                {photo.category}
              </span>
              <h4 className="text-white font-black text-2xl tracking-tighter mb-2">{photo.title}</h4>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{photo.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox (Visualização Ampliada) */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[110] bg-gray-950/98 backdrop-blur-2xl flex items-center justify-center p-6"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-5xl w-full flex flex-col items-center animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
            <div className="relative group w-full">
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

export default PhotoGallery;
