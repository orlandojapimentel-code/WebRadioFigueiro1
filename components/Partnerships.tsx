
import React from 'react';

const Partnerships: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-600 rounded-2xl shadow-lg shadow-green-600/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          </div>
          <h3 className="text-3xl font-black tracking-tight">Parceiros de Estrada</h3>
        </div>
      </div>

      {/* Card Principal: FM Rent a Car */}
      <div className="bg-white rounded-[2.5rem] p-8 text-gray-900 group cursor-pointer transition-all hover:shadow-[0_20px_60px_rgba(34,197,94,0.15)] overflow-hidden relative"
           onClick={() => window.open('https://fm-bicycle.pt/', '_blank')}>
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700">
           <svg className="w-64 h-64 rotate-12" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
          <div className="h-44 w-44 bg-gray-50 rounded-[2rem] flex items-center justify-center p-6 border border-gray-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
             <img src="https://fm-bicycle.pt/wp-content/uploads/2021/04/cropped-Logo-FM-Bicycle-House-1.png" alt="FM Rent a Car" className="w-full h-auto object-contain" onError={(e) => e.currentTarget.src = 'https://picsum.photos/seed/car/200/200'} />
          </div>
          <div className="space-y-5 text-center lg:text-left flex-grow">
            <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">Parceiro Premium</div>
            <h4 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tighter">
              FM - Rent a Car <br/>& Bicycle House
            </h4>
            <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-2xl">
              Soluções completas de mobilidade: Táxis, veículos de transporte e seguros. 
              Desfrute também do nosso alojamento local exclusivo em Felgueiras.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
               <span className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl group-hover:bg-green-600 transition-all duration-300">
                 Explorar Serviços
               </span>
               <button className="bg-gray-100 text-gray-700 px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all">
                 Pedir Orçamento
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partnerships;
