
import React from 'react';

interface Partner {
  name: string;
  logo: string;
  url: string;
  description?: string;
  highlight?: boolean;
  isTextLogo?: boolean;
}

const Partnerships: React.FC = () => {
  const partners: Partner[] = [
    { 
      name: "F.M. Rent-a-Car & Bicycle House", 
      logo: "https://www.dropbox.com/scl/fi/8la6gvr4dxctbqidu43i7/IMG-20240205-WA0036.jpg?rlkey=91k4rg9fqhkchiiiyr1w7v07g&st=mhw8hm2l&raw=1",
      isTextLogo: false,
      url: "https://fm-bicycle.pt/",
      description: "Soluções de mobilidade em Felgueiras: Táxi, transporte escolar e aluguer de veículos. Conheça também o nosso alojamento local.",
      highlight: true
    },
    { name: "Município de Amarante", logo: "https://www.cm-amarante.pt/wp-content/uploads/2021/03/logo_cm_amarante.png", url: "https://www.cm-amarante.pt/" },
    { name: "Junta de Freguesia de Figueiró", logo: "https://picsum.photos/seed/partner1/200/100", url: "#" },
    { name: "Associação Cultural", logo: "https://picsum.photos/seed/partner2/200/100", url: "#" },
    { name: "Comércio Local", logo: "https://picsum.photos/seed/partner3/200/100", url: "#" },
    { name: "Rádio Regional", logo: "https://picsum.photos/seed/partner4/200/100", url: "#" }
  ];

  return (
    <section id="parcerias" className="py-8 sm:py-12 border-t border-white/[0.08]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center mb-10 text-center">
          <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Rede de Apoio</span>
          <h3 className="text-2xl sm:text-4xl font-brand font-black text-white tracking-tight">As Nossas Parcerias</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-2">Instituições, empresas e entidades que fortalecem a nossa emissão comunitária</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {partners.map((partner, index) => (
            <a 
              key={index} 
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass-card glass-card-interactive p-5 flex flex-col items-center justify-center transition-all duration-300 relative group overflow-hidden min-h-[140px]
                ${partner.highlight 
                  ? 'border-red-500/40 bg-red-950/10 shadow-[0_0_25px_rgba(220,38,38,0.15)]' 
                  : 'hover:border-white/20'}`}
              title={partner.description || partner.name}
            >
              {partner.isTextLogo ? (
                <span className="text-3xl font-black text-red-500 mb-2 tracking-tighter">
                  {partner.logo}
                </span>
              ) : (
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className={`max-h-12 max-w-[85%] object-contain transition-all duration-300 mb-3
                    ${partner.highlight ? 'opacity-100' : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'}`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=${partner.highlight ? 'dc2626' : '1e293b'}&color=fff&size=200`;
                  }}
                />
              )}
              <span className={`text-[9px] font-bold uppercase tracking-wider text-center line-clamp-2 transition-colors
                ${partner.highlight ? 'text-red-400' : 'text-slate-400 group-hover:text-white'}`}>
                {partner.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partnerships;
