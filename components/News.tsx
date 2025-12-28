
import React from 'react';

const News: React.FC = () => {
  const newsItems = [
    { title: "Novo Podcast Disponível", date: "Há 2 horas", type: "Podcast" },
    { title: "Entrevista com...", date: "Ontem", type: "Destaque" },
    { title: "Promoção Verão Figueiró", date: "2 dias atrás", type: "Oferta" }
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold">Novidades</h4>
        <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded-full text-white animate-pulse font-bold">LIVE</span>
      </div>
      <div className="space-y-4">
        {newsItems.map((item, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="flex items-center justify-between text-[10px] text-blue-400 font-bold uppercase mb-1">
              <span>{item.type}</span>
              <span className="text-gray-500">{item.date}</span>
            </div>
            <h5 className="text-sm font-medium group-hover:text-blue-400 transition-colors">{item.title}</h5>
            <div className="h-[1px] bg-white/5 mt-3 group-last:hidden"></div>
          </div>
        ))}
      </div>
      <button className="w-full py-2 bg-gray-900 border border-white/5 rounded-xl text-xs font-bold hover:bg-gray-700 transition-colors">
        Ver Tudo
      </button>
    </div>
  );
};

export default News;
