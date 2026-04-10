export type Language = 'pt' | 'en' | 'es' | 'fr';

export interface Translation {
  nav: {
    prog: string;
    media: string;
    gallery: string;
    news: string;
    contactBtn: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    stats: {
      listeners: string;
      programs: string;
      reach: string;
    };
  };
  schedule: {
    title: string;
    days: string[];
  };
  request: {
    title: string;
    subtitle: string;
    whatsapp: string;
    orSite: string;
    artist: string;
    song: string;
    dedication: string;
    name: string;
    email: string;
    submit: string;
  };
  player: {
    tuning: string;
    live: string;
  };
}

export const translations: Record<Language, Translation> = {
  pt: {
    nav: {
      prog: 'Programação',
      media: 'Multimédia',
      gallery: 'Galeria',
      news: 'Notícias',
      contactBtn: 'Contactar'
    },
    hero: {
      title: 'A Sua Rádio em Amarante',
      subtitle: 'Sintonize a melhor música e notícias locais 24h por dia.',
      description: 'A voz de Amarante para o mundo, com emissão digital de alta fidelidade e a melhor companhia',
      cta: 'Ouvir Agora',
      stats: {
        listeners: 'Ouvintes Mensais',
        programs: 'Programas Ativos',
        reach: 'Alcance Global'
      }
    },
    schedule: {
      title: 'Programação Semanal',
      days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
    },
    request: {
      title: 'Pedir Música',
      subtitle: 'Peça a sua música favorita',
      whatsapp: 'Pedir via WhatsApp',
      orSite: 'Ou pelo site',
      artist: 'Artista',
      song: 'Música',
      dedication: 'Dedicatória',
      name: 'Seu Nome',
      email: 'Seu Email',
      submit: 'Enviar Pedido'
    },
    player: {
      tuning: 'Sintonizando...',
      live: 'DIRETO'
    }
  },
  en: {
    nav: {
      prog: 'Schedule',
      media: 'Multimedia',
      gallery: 'Gallery',
      news: 'News',
      contactBtn: 'Contact'
    },
    hero: {
      title: 'Your Radio in Amarante',
      subtitle: 'Tune in to the best music and local news 24/7.',
      description: 'The voice of Amarante to the world, with high-fidelity digital broadcast and the best company',
      cta: 'Listen Now',
      stats: {
        listeners: 'Monthly Listeners',
        programs: 'Active Programs',
        reach: 'Global Reach'
      }
    },
    schedule: {
      title: 'Weekly Schedule',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    request: {
      title: 'Request Song',
      subtitle: 'Ask for your favorite song',
      whatsapp: 'Request via WhatsApp',
      orSite: 'Or via website',
      artist: 'Artist',
      song: 'Song',
      dedication: 'Dedication',
      name: 'Your Name',
      email: 'Your Email',
      submit: 'Send Request'
    },
    player: {
      tuning: 'Tuning...',
      live: 'LIVE'
    }
  },
  es: {
    nav: {
      prog: 'Programación',
      media: 'Multimedia',
      gallery: 'Galería',
      news: 'Noticias',
      contactBtn: 'Contactar'
    },
    hero: {
      title: 'Su Radio en Amarante',
      subtitle: 'Sintonice la mejor música y noticias locales las 24 horas.',
      description: 'La voz de Amarante para el mundo, con emisión digital de alta fidelidade e a melhor companhia',
      cta: 'Escuchar Ahora',
      stats: {
        listeners: 'Oyentes Mensuales',
        programs: 'Programas Ativos',
        reach: 'Alcance Global'
      }
    },
    schedule: {
      title: 'Programación Semanal',
      days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    },
    request: {
      title: 'Pedir Música',
      subtitle: 'Pide tu canción favorita',
      whatsapp: 'Pedir por WhatsApp',
      orSite: 'O por el sitio',
      artist: 'Artista',
      song: 'Canción',
      dedication: 'Dedicatoria',
      name: 'Tu Nombre',
      email: 'Tu Email',
      submit: 'Enviar Pedido'
    },
    player: {
      tuning: 'Sintonizando...',
      live: 'DIRECTO'
    }
  },
  fr: {
    nav: {
      prog: 'Programme',
      media: 'Multimédia',
      gallery: 'Galerie',
      news: 'Nouvelles',
      contactBtn: 'Contact'
    },
    hero: {
      title: 'Votre Radio à Amarante',
      subtitle: 'Écoutez la meilleure musique et les nouvelles locales 24h/24.',
      description: 'La voix d\'Amarante vers le monde, avec une diffusion numérique haute fidélité et la meilleure compagnie',
      cta: 'Écouter Maintenant',
      stats: {
        listeners: 'Auditeurs Mensuels',
        programs: 'Programmes Actifs',
        reach: 'Portée Mondiale'
      }
    },
    schedule: {
      title: 'Programme Hebdomadaire',
      days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    },
    request: {
      title: 'Demander une chanson',
      subtitle: 'Demandez votre chanson préférée',
      whatsapp: 'Demander via WhatsApp',
      orSite: 'Ou via le site',
      artist: 'Artiste',
      song: 'Chanson',
      dedication: 'Dédicace',
      name: 'Votre Nom',
      email: 'Votre Email',
      submit: 'Envoyer la demande'
    },
    player: {
      tuning: 'Syntonisation...',
      live: 'EN DIRECT'
    }
  }
};
