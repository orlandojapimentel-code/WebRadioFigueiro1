
import React, { useState } from 'react';

const Partnerships: React.FC = () => {
  const [imgError, setImgError] = useState(false);
  
  // Caminho para a imagem fornecida. 
  // Basta carregar o ficheiro como "parceiro_fm.png"
  const fmLogoPath = "parceiro_fm.png";

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4 border-b border-gray-800 pb-4">
        <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <h3 className="text-3xl font-black tracking-tight text-white">Parceiros de Estrada</h3>
      </div>

      {/* Card Principal: FM Rent a Car & Bicycle House */}
      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 text-gray-900 group cursor-pointer transition-all hover:shadow-[0_30px_70px_rgba(43,57,144,0.2)] overflow-hidden relative"
           onClick={() => window.open('https://fm-bicycle.pt/', '_blank')}>
        
        {/* Marca d'água decorativa */}
        <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-1000 group-hover:scale-110">
           <svg className="w-80 h-80" fill="#2b3990" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/></svg>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 relative z-10">
          {/* Contentor do Logo */}
          <div className="h-56 w-56 md:h-64 md:w-64 bg-gray-50 rounded-[2.5rem] flex items-center justify-center p-4 border border-gray-100 shadow-inner group-hover:scale-105 transition-transform duration-700 overflow-hidden bg-white">
             {!imgError ? (
               <img 
                 src={fmLogoPath} 
                 alt="FM Rent a Car & Bicycle House" 
                 className="w-full h-full object-contain" 
                 onError={() => setImgError(true)} 
               />
             ) : (
               <div className="flex flex-col items-center justify-center text-center">
                 <span className="text-6xl font-black text-[#2b3990] tracking-tighter italic">F.M.</span>
                 <span className="text-[10px] font-bold text-red-600 uppercase mt-1">Bicycle House</span>
               </div>
             )}
          </div>

          {/* Textos e Info */}
          <div className="space-y-6 text-center lg:text-left flex-grow">
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-2">
              <span className="bg-[#2b3990]/10 text-[#2b3990] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#2b3990]/10">Parceiro Premium</span>
              <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-100">Destaque</span>
            </div>
            
            <h4 className="text-4xl md:text-6xl font-black text-gray-950 leading-[1] tracking-tighter">
              F.M. <span className="text-[#2b3990]">Rent-a-Car</span> <br/>
              <span className="text-red-600">& Bicycle House</span>
            </h4>
            
            <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed max-w-2xl">
              Soluções completas de mobilidade em Felgueiras: <span className="text-gray-900 font-bold">Serviço de Táxi</span>, 
              <span className="text-gray-900 font-bold"> Transporte de Crianças</span> e aluguer de veículos. 
              Visite a nossa Bicycle House e conheça o nosso alojamento local.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
               <button className="bg-[#2b3990] text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-[#2b3990]/20 hover:bg-[#1e2a70] hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2">
                 <span>Explorar Serviços</span>
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
               </button>
               <button className="bg-gray-100 text-gray-700 px-10 py-4 rounded-2xl font-black text-sm hover:bg-red-600 hover:text-white transition-all duration-300">
                 Pedir Orçamento
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Extra */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Serviço", val: "Táxis 24h", color: "border-blue-500/20" },
          { label: "Especialidade", val: "Escolar & Kids", color: "border-red-500/20" },
          { label: "Lazer", val: "Bicycle House", color: "border-green-500/20" }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-gray-800/30 p-4 rounded-2xl border ${stat.color} text-center`}>
            <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1">{stat.label}</p>
            <p className="text-white font-bold">{stat.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partnerships;
