import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Partner {
  name: string;
  monogram: string;
  logo?: string;
  url: string;
  description?: string;
  highlight?: boolean;
}

const PartnerCard: React.FC<{ partner: Partner }> = ({ partner }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={partner.url}
      target={partner.url === '#' ? undefined : '_blank'}
      rel={partner.url === '#' ? undefined : 'noopener noreferrer'}
      onClick={partner.url === '#' ? (e) => e.preventDefault() : undefined}
      className={`glass-card glass-card-interactive p-5 flex flex-col items-center justify-center text-center min-h-[132px] ${
        partner.highlight ? 'border-red-500/40 dark:border-red-500/40' : ''
      }`}
      title={partner.description || partner.name}
    >
      {partner.logo && !imgError ? (
        <img
          src={partner.logo}
          alt={partner.name}
          className="max-h-11 max-w-[85%] object-contain mb-3"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center font-brand font-black text-sm mb-3 border ${
            partner.highlight
              ? 'bg-red-600 text-white border-red-500'
              : 'bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10'
          }`}
        >
          {partner.monogram}
        </div>
      )}

      <span
        className={`text-xs font-bold leading-snug line-clamp-2 ${
          partner.highlight
            ? 'text-red-600 dark:text-red-400'
            : 'text-slate-700 dark:text-slate-300'
        }`}
      >
        {partner.name}
      </span>
    </a>
  );
};

const Partnerships: React.FC = () => {
  const { t } = useLanguage();

  const partners: Partner[] = [
    {
      name: 'F.M. Rent-a-Car & Bicycle House',
      monogram: 'FM',
      logo: 'https://www.dropbox.com/scl/fi/8la6gvr4dxctbqidu43i7/IMG-20240205-WA0036.jpg?rlkey=91k4rg9fqhkchiiiyr1w7v07g&st=mhw8hm2l&raw=1',
      url: 'https://fm-bicycle.pt/',
      description: 'Soluções de mobilidade em Felgueiras: Táxi, transporte escolar e aluguer de veículos.',
      highlight: true,
    },
    {
      name: 'Município de Amarante',
      monogram: 'MA',
      logo: 'https://www.cm-amarante.pt/wp-content/uploads/2021/03/logo_cm_amarante.png',
      url: 'https://www.cm-amarante.pt/',
    },
    {
      name: 'Junta de Freguesia de Figueiró',
      monogram: 'JF',
      url: '#',
    },
    {
      name: 'Associação Cultural',
      monogram: 'AC',
      url: '#',
    },
    {
      name: 'Comércio Local',
      monogram: 'CL',
      url: '#',
    },
    {
      name: 'Rádio Regional',
      monogram: 'RR',
      url: '#',
    },
  ];

  return (
    <section id="parcerias" className="py-8 sm:py-12 border-t border-slate-200 dark:border-white/[0.08]">
      <div className="flex flex-col items-center mb-10 text-center">
        <span className="text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">
          {t.partners.kicker}
        </span>
        <h3 className="text-2xl sm:text-3xl font-brand font-black text-slate-900 dark:text-white tracking-tight">
          {t.partners.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mt-2">
          {t.partners.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
        {partners.map((partner, index) => (
          <PartnerCard key={index} partner={partner} />
        ))}
      </div>
    </section>
  );
};

export default Partnerships;
