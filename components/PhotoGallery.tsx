
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

  // --- CONFIGURAÇÃO DAS FOTOS POR CATEGORIA ---
  // Dica: Coloque as suas fotos no GitHub dentro de pastas como "images/eventos/"
  
  const FOTOS_EVENTOS: Photo[] = [
    {
      id: 101,
      url: "images/eventos/festa_verao.png",
      title: "Arraial de Figueiró",
      category: "eventos",
      description: "Grande animação no arraial anual da nossa freguesia."
    },
    {
      id: 102,
      url: "images/eventos/gala_aniversario.png",
      title: "Gala de Aniversário",
      category: "eventos",
      description: "Celebração dos 5 anos da nossa rádio com a comunidade."
    }
  ];

  const FOTOS_LUGARES: Photo[] = [
    {
      id: 201,
      url: "images/lugares/miradouro.png",
      title: "Miradouro de Santa Eufémia",
      category: "lugares",
      description: "Uma das vistas mais bonitas sobre o vale de Figueiró."
    },
    {
      id: 202,
      url: "images/lugares/rio_tamega.png",
      title: "Margens do Tâmega",
      category: "lugares",
      description: "Onde o rio encontra a paz da nossa terra."
    }
  ];

  const FOTOS_ESTUDIO: Photo[] = [
    {
      id: 301,
      url: "images/estudio/mesa_mistura.png",
      title: "Coração da Emissão",
      category: "estudio",
      description: "A nossa mesa de mistura onde controlamos o som que chega até si."
    },
    {
      id: 302,
      url: "images/estudio/sala_convidados.png",
      title: "Sala de Entrevistas",
      category: "estudio",
      description: "O espaço onde recebemos os protagonistas da nossa região."
    }
  ];

  // Juntamos todas as fotos num único array para o filtro "Ver Todas"
  const allPhotos: Photo[] = [...FOTOS_EVENTOS, ...FOTOS_LUGARES, ...FOTOS_ESTUDIO];

  // Lógica de filtragem
  const filteredPhotos = filter === 'todos' 
    ? allPhotos 
    : allPhotos.filter(p => p.category === filter);

  // Fallback para quando a imagem ainda não foi carregada no repositório
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop"; 
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-800 pb-8">
        <div className="flex items-center space-x-5">
          <div className="p-4 bg-indigo-600 rounded-[1.5rem] shadow-[0_10px_30px_rgba(79,70,229,0.3)]">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-3xl font-black text-white tracking-tight">Galeria Fotográfica</h3>
            <p className="text-sm text-indigo-400 font-bold uppercase tracking-widest mt-1">Nossa Terra, Nossa Gente, Nossa Rádio</p>
          </div>
        </div>

        {/* Menu de Filtros Estilizado */}
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
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                filter === cat.id 
                  ? 'bg-white text-gray-900 shadow-xl scale-105' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Fotos com animação suave */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPhotos.map((photo) => (
          <div 
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative h-80 rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5 bg-gray-800 shadow-lg hover:shadow-indigo-500/10 transition-all duration-500"
          >
            <img 
              src={photo.url} 
              alt={photo.title}
              onError={handleImageError}
              className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
            />
            
            {/* Overlay Gradiente ao fazer Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="inline-block px-3 py-1 rounded-lg bg-indigo-600 text-[9px] font-black uppercase tracking-widest text-white mb-3">
                  {photo.category}
                </span>
                <h4 className="text-white font-black text-2xl tracking-tighter mb-2">{photo.title}</h4>
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{photo.description}</p>
              </div>
            </div>

            {/* Ícone de Expansão (discreto) */}
            <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Visualização Lightbox (Ecrã Inteiro) */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[110] bg-gray-950/98 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500"
          onClick={() => setSelectedPhoto(null)}
        >
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2 hover:rotate-90 duration-300">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="max-w-6xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <div className="relative rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)] border border-white/10 mb-8 bg-black">
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.title}
                onError={handleImageError}
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-500/20">
                {selectedPhoto.category}
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{selectedPhoto.title}</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">{selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
