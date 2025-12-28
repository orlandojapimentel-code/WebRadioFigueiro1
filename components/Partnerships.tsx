
import React from 'react';

const Partnerships: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-600 rounded-2xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          </div>
          <h3 className="text-3xl font-black">Promoção & Parcerias</h3>
        </div>
        <a href="mailto:webradiofigueiro@gmail.pt" className="text-sm text-blue-400 hover:underline">Saber Mais</a>
      </div>

      <div className="bg-white rounded-[2rem] p-8 text-gray-900 group cursor-pointer transition-all hover:shadow-2xl hover:shadow-green-500/20 overflow-hidden relative"
           onClick={() => window.open('https://fm-bicycle.pt/', '_blank')}>
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <svg className="w-48 h-48 rotate-12" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="h-40 w-40 bg-gray-100 rounded-3xl flex items-center justify-center p-4 border border-gray-200">
             <img src="https://picsum.photos/seed/car/400/400" alt="FM Rent a Car Logo" className="w-full h-auto object-contain rounded-xl" />
          </div>
          <div className="space-y-4 text-center md:text-left flex-grow">
            <h4 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              FM - Rent a car & Bicycle House
            </h4>
            <p className="text-lg text-gray-600 font-medium max-w-xl">
              Serviços Rent a Car, Táxis, veículos de Transporte de Crianças e Seguros.
A F.M tem ainda disponível um alojamento local com piscina em zona calma de Felgueiras.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <span className="bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg group-hover:bg-green-700 transition-colors">
                 Visitar Site
               </span>
               <a href="mailto:webradiofigueiro@gmail.pt" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-bold hover:bg-gray-300 transition-colors">
                 Pedir Informações
               </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 text-center space-y-4">
          <h5 className="text-xl font-bold">Sua Empresa Aqui</h5>
          <p className="text-gray-400 text-sm">Alcance milhares de ouvintes todos os dias através da nossa rede.</p>
          <a href="mailto:webradiofigueiro@gmail.pt" className="inline-block bg-blue-600 px-6 py-3 rounded-xl font-bold text-white hover:bg-blue-700 transition-all">
            Enviar Email
          </a>
        </div>
        <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <p className="font-bold">Junte-se à nossa Família</p>
          <button onClick={() => window.location.href='mailto:webradiofigueiro@gmail.pt'} className="text-blue-400 hover:text-blue-300 font-medium">Saber Mais →</button>
        </div>
      </div>
    </div>
  );
};

export default Partnerships;
