
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
      logo: "F.M.",
      isTextLogo: true,
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
    <section id="parcerias" className="py-12 md:py-20 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Rede de Apoio</span>
          <h3 className="text-3xl md:text-5xl font-brand font-black text-white tracking-tighter text-center">As Nossas Parcerias</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {partners.map((partner, index) => (
            <a 
              key={index} 
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative bg-white/5 backdrop-blur-md border rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-500 hover:-translate-y-1
                ${partner.highlight 
                  ? 'border-blue-500/50 bg-blue-600/5 grayscale-0 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                  : 'border-white/10 grayscale hover:grayscale-0 hover:bg-white/10 hover:border-red-500/30'}`}
              title={partner.description || partner.name}
            >
              {partner.isTextLogo ? (
                <span className="text-4xl font-black text-blue-500 mb-2 tracking-tighter">
                  {partner.logo}
                </span>
              ) : (
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className={`max-h-12 w-auto object-contain transition-opacity mb-2 
                    ${partner.highlight ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=${partner.highlight ? '0066ff' : 'random'}&color=fff&size=200`;
                  }}
                />
              )}
              <span className={`text-[8px] font-black uppercase tracking-widest text-center transition-colors
                ${partner.highlight ? 'text-blue-400' : 'text-white/40 group-hover:text-red-500'}`}>
                {partner.name}
              </span>
              <div className={`absolute inset-0 rounded-2xl transition-opacity
                ${partner.highlight 
                  ? 'bg-gradient-to-br from-blue-600/0 to-blue-600/10 opacity-100' 
                  : 'bg-gradient-to-br from-red-600/0 to-red-600/5 opacity-0 group-hover:opacity-100'}`}></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partnerships;
