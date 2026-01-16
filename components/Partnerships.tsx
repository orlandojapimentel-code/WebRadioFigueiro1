
import React, { useState } from 'react';

const Partnerships: React.FC = () => {
  const [imgError, setImgError] = useState(false);
  const fmLogoPath = "parceiro_fm.png";

  return (
    <div className="space-y-12">
      {/* HEADER DA SECÇÃO */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Nossas Parcerias</h3>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Crescemos Juntos</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* PARCEIRO PRINCIPAL: FM Rent a Car */}
        <div className="bg-white dark:bg-gray-800/40 rounded-[2.5rem] p-6 md:p-10 text-gray-900 dark:text-white group cursor-pointer transition-all hover:shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden relative"
             onClick={() => window.open('https://fm-bicycle.pt/', '_blank')}>
          
          <div className="absolute -bottom-10 -right-10 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.08] transition-all duration-1000 group-hover:scale-110">
             <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/></svg>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 relative z-10">
            <div className="h-48 w-48 md:h-56 md:w-56 bg-white rounded-[2.5rem] flex items-center justify-center p-6 border border-gray-100 shadow-inner group-hover:scale-105 transition-transform duration-700 overflow-hidden">
               {!imgError ? (
                 <img src={fmLogoPath} alt="FM" className="w-full h-full object-contain" onError={() => setImgError(true)} />
               ) : (
                 <div className="text-center"><span className="text-5xl font-black text-blue-900 italic">F.M.</span></div>
               )}
            </div>

            <div className="space-y-4 text-center lg:text-left flex-grow">
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                <span className="bg-blue-600/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-600/10">Parceiro Premium</span>
              </div>
              <h4 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter">
                F.M. <span className="text-blue-600">Rent-a-Car</span> <br/>
                <span className="text-red-600">& Bicycle House</span>
              </h4>
              <p className="text-slate-600 dark:text-gray-400 font-medium leading-relaxed max-w-xl">
                Soluções de mobilidade em Felgueiras: Táxi, transporte escolar e aluguer de veículos. Conheça também o nosso alojamento local.
              </p>
            </div>
          </div>
        </div>

        {/* CARD: TORNE-SE PARCEIRO (INFO) */}
        <div className="relative rounded-[2.5rem] p-1 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
          <div className="bg-white dark:bg-gray-950 rounded-[2.3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-center gap-8 h-full">
            <div className="space-y-6 text-center max-w-2xl">
              <div>
                <span className="inline-block px-4 py-1 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Oportunidade</span>
                <h4 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                  Sua Marca Aqui<span className="text-blue-600">.</span>
                </h4>
              </div>
              <p className="text-slate-500 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
                Junte-se à Web Rádio Figueiró e alcance milhares de ouvintes diariamente. Promova o seu negócio com quem entende de comunicação local.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-300">Visibilidade Local</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-gray-300">Audiência Digital</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RODAPÉ DE INFO EXTRA */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Ouvintes", val: "+10k Mês", color: "text-blue-500" },
          { label: "Alcance", val: "Global", color: "text-indigo-500" },
          { label: "Social", val: "Forte Impacto", color: "text-purple-500" },
          { label: "Suporte", val: "Personalizado", color: "text-emerald-500" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/5 text-center">
            <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest mb-1">{stat.label}</p>
            <p className={`font-bold ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partnerships;
