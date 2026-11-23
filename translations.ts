export type Language = 'pt' | 'en' | 'es' | 'fr';

export interface Translation {
  nav: {
    prog: string;
    media: string;
    playlist: string;
    gallery: string;
    news: string;
    contactBtn: string;
    openMenu: string;
    closeMenu: string;
    listenLive: string;
    onAir: string;
  };
  ticker: {
    liveLabel: string;
    localLabel: string;
    syncing: string;
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    description: string;
    since: string;
    cta: string;
    pauseCta: string;
    nowPlayingLabel: string;
    qualityLabel: string;
    originLabel: string;
    broadcastLabel: string;
    originValue: string;
    broadcastValue: string;
  };
  bento: {
    agendaKicker: string;
    agendaTitle: string;
    agendaDesc: string;
    agendaCta: string;
    nextHighlight: string;
    loading: string;
    fallbackEventTitle: string;
    fallbackEventDate: string;
    highlightsKicker: string;
    highlightsTitle: string;
    nightGroovesSub: string;
    nightGroovesDesc: string;
    prazeresSub: string;
    prazeresDesc: string;
    viewFullSchedule: string;
    pharmacyKicker: string;
    pharmacyTitle: string;
    pharmacyDesc: string;
    pharmacyCta: string;
    galleryKicker: string;
    galleryTitle: string;
    galleryDesc: string;
    galleryCta: string;
  };
  schedule: {
    kicker: string;
    title: string;
    days: string[];
    localTime: string;
    onAir: string;
    timeLabel: string;
    specialTitle: string;
    sundays: string;
    wedFri: string;
    nightGroovesDesc: string;
    prazeresDesc: string;
    programs: { time: string; start: number; end: number; name: string; host: string }[];
  };
  media: {
    kicker: string;
    title: string;
    subtitle: string;
    tabs: {
      playlist: string;
      podcasts: string;
      videos: string;
      musicVideos: string;
    };
    playing: string;
    ready: string;
    suggestTitle: string;
    suggestDesc: string;
    originalLabel: string;
  };
  playlist: {
    tracklistTitle: string;
    ofWord: string;
    songsCredit: string;
    searchPlaceholder: string;
    playAll: string;
    trackLabel: string;
    playingBadge: string;
    noResults: string;
    loadingAudio: string;
    shuffleOn: string;
    shuffleOff: string;
    prev: string;
    next: string;
    play: string;
    pause: string;
    repeatAll: string;
    repeatOne: string;
    repeatOff: string;
    mute: string;
    unmute: string;
    clickToSeek: string;
  };
  news: {
    kicker: string;
    autoBadge: string;
    title: string;
    refresh: string;
    loading: string;
    readFull: string;
    readSource: string;
    backHome: string;
    sourcePrefix: string;
    editorialRoom: string;
  };
  weather: {
    kicker: string;
    location: string;
    syncing: string;
    feelsLike: string;
    clear: string;
    partlyCloudy: string;
    fog: string;
    rain: string;
    snow: string;
    showers: string;
    storm: string;
    cloudy: string;
  };
  request: {
    kicker: string;
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
  counter: {
    kicker: string;
    activeLabel: string;
    onlineLabel: string;
    caption: string;
  };
  gallery: {
    kicker: string;
    cardTitle: string;
    cardDesc: string;
    viewPhotos: string;
    modalTitle: string;
    close: string;
    all: string;
    studio: string;
    events: string;
    places: string;
    modalFooter: string;
  };
  agenda: {
    kicker: string;
    title: string;
    close: string;
    tuning: string;
    unavailableTitle: string;
    unavailableDesc: string;
    reload: string;
    viewDetails: string;
    footer: string;
  };
  partners: {
    kicker: string;
    title: string;
    subtitle: string;
  };
  footer: {
    tagline: string;
    certified: string;
    rights: string;
  };
  player: {
    tuning: string;
    live: string;
    standby: string;
    copyTitle: string;
    copied: string;
    mute: string;
    unmute: string;
    play: string;
    pause: string;
  };
}

export const translations: Record<Language, Translation> = {
  pt: {
    nav: {
      prog: 'Programação',
      media: 'Multimédia',
      playlist: 'Playlist',
      gallery: 'Galeria',
      news: 'Notícias',
      contactBtn: 'Contactar',
      openMenu: 'Abrir menu',
      closeMenu: 'Fechar menu',
      listenLive: 'Ouvir',
      onAir: 'No Ar',
    },
    ticker: {
      liveLabel: 'Amarante Hoje',
      localLabel: 'WRF Notícias',
      syncing: 'Sincronizando...',
    },
    hero: {
      kicker: 'Figueiró · Amarante · Emissão Digital 24/7',
      title: 'A Sua Rádio em Amarante',
      subtitle: 'Sintonize a melhor música e notícias locais 24h por dia.',
      description: 'A voz de Amarante para o mundo, com emissão digital de alta fidelidade, informação regional e a melhor companhia',
      since: 'desde 2022',
      cta: 'Ouvir Agora',
      pauseCta: 'Pausar Emissão',
      nowPlayingLabel: 'Agora no Ar',
      qualityLabel: 'Qualidade',
      originLabel: 'Origem',
      broadcastLabel: 'Emissão',
      originValue: 'Amarante, PT',
      broadcastValue: '24/7 Online',
    },
    bento: {
      agendaKicker: 'Eventos & Tradição',
      agendaTitle: 'Agenda Cultural',
      agendaDesc: 'Fique a par dos eventos culturais, concertos, festas populares e iniciativas em Amarante e no vale do Tâmega.',
      agendaCta: 'Explorar Agenda',
      nextHighlight: 'Próximo Destaque',
      loading: 'A carregar...',
      fallbackEventTitle: 'Jornadas do Património - Rota dos Moinhos',
      fallbackEventDate: 'Figueiró, Amarante',
      highlightsKicker: 'Emissão Especial',
      highlightsTitle: 'Destaques da Rádio',
      nightGroovesSub: 'Domingos ao vivo',
      nightGroovesDesc: '1ª Hora: DJ Durval · 2ª Hora: Convidado',
      prazeresSub: 'Quartas e Sextas',
      prazeresDesc: 'Crónicas literárias & Música de autor',
      viewFullSchedule: 'Ver Grelha Completa',
      pharmacyKicker: 'Serviço Público',
      pharmacyTitle: 'Farmácias de Serviço',
      pharmacyDesc: 'Consulte em tempo real as farmácias de turno e piquetes abertos na região de Amarante.',
      pharmacyCta: 'Ver Farmácias de Turno',
      galleryKicker: 'Estúdio & Eventos',
      galleryTitle: 'Galeria de Fotos',
      galleryDesc: 'Momentos da nossa equipa, eventos regionais e recantos de Figueiró.',
      galleryCta: 'Abrir Galeria',
    },
    schedule: {
      kicker: 'Grelha de Emissão',
      title: 'Programação 24/7',
      days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      localTime: 'Hora Local',
      onAir: 'No Ar',
      timeLabel: 'Horário',
      specialTitle: 'Programas Especiais em Destaque',
      sundays: 'Domingos',
      wedFri: 'Quartas & Sextas',
      nightGroovesDesc: '1ª Hora: DJ Durval · 2ª Hora: DJ Convidado. O melhor da música eletrónica e soulful grooves.',
      prazeresDesc: 'Crónicas, literatura e música seleta. Emissão às 13:00 com repetição às 20:00.',
      programs: [
        { time: '08:00 - 10:00', start: 8, end: 10, name: 'Manhãs Figueiró', host: 'Música para começar o dia' },
        { time: '10:00 - 13:00', start: 10, end: 13, name: 'Top Hits', host: 'As mais pedidas do momento' },
        { time: '13:00 - 15:00', start: 13, end: 15, name: 'Almoço Musical', host: 'Sons tranquilos para a hora de almoço' },
        { time: '15:00 - 19:00', start: 15, end: 19, name: 'Tardes em Movimento', host: 'Energia para o seu regresso a casa' },
        { time: '19:00 - 08:00', start: 19, end: 32, name: 'Noite Digital', host: 'Música non-stop pela madrugada' },
      ],
    },
    media: {
      kicker: 'Multimédia & Música',
      title: 'Explorar Conteúdos',
      subtitle: 'Playlist de autor, podcasts, entrevistas e vídeos',
      tabs: {
        playlist: 'Playlist (15)',
        podcasts: 'Podcasts',
        videos: 'Vídeos',
        musicVideos: 'Vídeos Musicais',
      },
      playing: 'A Reproduzir',
      ready: 'Pronto',
      suggestTitle: 'Sugerir Conteúdo',
      suggestDesc: 'Envie-nos a sua sugestão ou tema para debate',
      originalLabel: 'Conteúdo Original',
    },
    playlist: {
      tracklistTitle: 'Lista de Faixas',
      ofWord: 'de',
      songsCredit: 'canções de Orlando José Pimentel',
      searchPlaceholder: 'Pesquisar música...',
      playAll: 'Tocar Todas',
      trackLabel: 'Faixa',
      playingBadge: 'A tocar',
      noResults: 'Nenhuma música encontrada para',
      loadingAudio: 'A carregar áudio...',
      shuffleOn: 'Modo Aleatório Ativado',
      shuffleOff: 'Ativar Modo Aleatório',
      prev: 'Música anterior',
      next: 'Próxima música',
      play: 'Reproduzir música',
      pause: 'Pausar música',
      repeatAll: 'Repetir toda a playlist',
      repeatOne: 'Repetir esta música',
      repeatOff: 'Repetição desativada',
      mute: 'Silenciar',
      unmute: 'Ativar som',
      clickToSeek: 'Clique para avançar ou recuar',
    },
    news: {
      kicker: 'Jornalismo Regional',
      autoBadge: 'Atualização Automática',
      title: 'Últimas Notícias da Região',
      refresh: 'Atualizar',
      loading: 'A carregar...',
      readFull: 'Ler Notícia Completa',
      readSource: 'Ler no portal de origem',
      backHome: 'Voltar',
      sourcePrefix: 'Fonte',
      editorialRoom: 'Redação WRF',
    },
    weather: {
      kicker: 'Meteorologia Local',
      location: 'Figueiró, Amarante',
      syncing: 'A carregar meteorologia...',
      feelsLike: 'Sensação',
      clear: 'Céu Limpo',
      partlyCloudy: 'Parcialmente Nublado',
      fog: 'Nevoeiro',
      rain: 'Chuva',
      snow: 'Neve',
      showers: 'Aguaceiros',
      storm: 'Trovoada',
      cloudy: 'Nublado',
    },
    request: {
      kicker: 'Interação',
      title: 'Pedir Música',
      subtitle: 'Peça a sua música favorita',
      whatsapp: 'Pedir via WhatsApp',
      orSite: 'Ou pelo site',
      artist: 'Artista',
      song: 'Música',
      dedication: 'Dedicatória',
      name: 'Seu Nome',
      email: 'Seu Email',
      submit: 'Enviar Pedido',
    },
    counter: {
      kicker: 'Audiência Global',
      activeLabel: 'Contador Ativo',
      onlineLabel: 'Online',
      caption: 'Ouvintes e visitas sincronizadas em tempo real',
    },
    gallery: {
      kicker: 'Bastidores & Eventos',
      cardTitle: 'Galeria de Fotos',
      cardDesc: 'Explore os momentos do estúdio, festas e recantos de Figueiró',
      viewPhotos: 'Ver Fotos',
      modalTitle: 'Galeria de Fotografias',
      close: 'Fechar',
      all: 'Todas',
      studio: 'Estúdio',
      events: 'Eventos',
      places: 'Lugares',
      modalFooter: 'Web Rádio Figueiró · Sintonizados na Comunidade',
    },
    agenda: {
      kicker: 'Exclusivo Web Rádio Figueiró',
      title: 'Agenda Cultural & Eventos',
      close: 'Fechar',
      tuning: 'Sintonizando eventos culturais...',
      unavailableTitle: 'Agenda Temporariamente Indisponível',
      unavailableDesc: 'Não foi possível carregar os eventos culturais neste momento. Tente novamente dentro de instantes.',
      reload: 'Recarregar Agenda',
      viewDetails: 'Ver Detalhes',
      footer: 'Web Rádio Figueiró · Agenda Cultural de Amarante',
    },
    partners: {
      kicker: 'Rede de Apoio',
      title: 'As Nossas Parcerias',
      subtitle: 'Instituições, empresas e entidades que fortalecem a nossa emissão comunitária',
    },
    footer: {
      tagline: 'A Voz do Vale do Tâmega · Amarante, Portugal',
      certified: 'Emissão Digital 24/7',
      rights: 'Web Rádio Figueiró. Todos os direitos reservados.',
    },
    player: {
      tuning: 'Sintonizando...',
      live: 'Em Direto · 320 kbps',
      standby: 'Pronta a Ouvir · 24/7',
      copyTitle: 'Copiar nome da música',
      copied: 'Copiado!',
      mute: 'Desativar som',
      unmute: 'Ativar som',
      play: 'Ouvir Rádio',
      pause: 'Pausar',
    },
  },
  en: {
    nav: {
      prog: 'Schedule',
      media: 'Multimedia',
      playlist: 'Playlist',
      gallery: 'Gallery',
      news: 'News',
      contactBtn: 'Contact',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      listenLive: 'Listen',
      onAir: 'On Air',
    },
    ticker: {
      liveLabel: 'Amarante Today',
      localLabel: 'WRF News',
      syncing: 'Syncing...',
    },
    hero: {
      kicker: 'Figueiró · Amarante · 24/7 Digital Broadcast',
      title: 'Your Radio in Amarante',
      subtitle: 'Tune in to the best music and local news 24/7.',
      description: 'The voice of Amarante to the world, with high-fidelity digital broadcast, regional updates, and great company',
      since: 'since 2022',
      cta: 'Listen Now',
      pauseCta: 'Pause Stream',
      nowPlayingLabel: 'Now Playing',
      qualityLabel: 'Quality',
      originLabel: 'Origin',
      broadcastLabel: 'Broadcast',
      originValue: 'Amarante, PT',
      broadcastValue: '24/7 Online',
    },
    bento: {
      agendaKicker: 'Events & Tradition',
      agendaTitle: 'Cultural Agenda',
      agendaDesc: 'Stay up to date with cultural events, concerts, folk festivals, and community gatherings across Amarante and the Tâmega valley.',
      agendaCta: 'Explore Agenda',
      nextHighlight: 'Next Highlight',
      loading: 'Loading...',
      fallbackEventTitle: 'Heritage Days - Watermills Route',
      fallbackEventDate: 'Figueiró, Amarante',
      highlightsKicker: 'Special Broadcast',
      highlightsTitle: 'Station Highlights',
      nightGroovesSub: 'Sundays live',
      nightGroovesDesc: '1st Hour: DJ Durval · 2nd Hour: Guest',
      prazeresSub: 'Wednesdays & Fridays',
      prazeresDesc: 'Literary chronicles & Author music',
      viewFullSchedule: 'Full Schedule',
      pharmacyKicker: 'Public Service',
      pharmacyTitle: 'On-Duty Pharmacies',
      pharmacyDesc: 'Check real-time on-duty pharmacies and emergency rotations in the Amarante area.',
      pharmacyCta: 'View On-Duty Pharmacies',
      galleryKicker: 'Studio & Events',
      galleryTitle: 'Photo Gallery',
      galleryDesc: 'Behind-the-scenes studio moments, regional festivals, and scenic views of Figueiró.',
      galleryCta: 'Open Gallery',
    },
    schedule: {
      kicker: 'Broadcast Grid',
      title: '24/7 Schedule',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      localTime: 'Local Time',
      onAir: 'On Air',
      timeLabel: 'Schedule',
      specialTitle: 'Featured Special Shows',
      sundays: 'Sundays',
      wedFri: 'Wednesdays & Fridays',
      nightGroovesDesc: '1st Hour: DJ Durval · 2nd Hour: Guest DJ. The best electronic music and soulful grooves.',
      prazeresDesc: 'Chronicles, literature, and curated music. Broadcast at 13:00 with replay at 20:00.',
      programs: [
        { time: '08:00 - 10:00', start: 8, end: 10, name: 'Figueiró Mornings', host: 'Music to start your day' },
        { time: '10:00 - 13:00', start: 10, end: 13, name: 'Top Hits', host: 'Most requested songs of the moment' },
        { time: '13:00 - 15:00', start: 13, end: 15, name: 'Musical Lunch', host: 'Easy listening for midday' },
        { time: '15:00 - 19:00', start: 15, end: 19, name: 'Afternoons in Motion', host: 'Energy for your evening commute' },
        { time: '19:00 - 08:00', start: 19, end: 32, name: 'Digital Night', host: 'Non-stop music through the night' },
      ],
    },
    media: {
      kicker: 'Multimedia & Music',
      title: 'Explore Content',
      subtitle: 'Original playlist, podcasts, interviews, and videos',
      tabs: {
        playlist: 'Playlist (15)',
        podcasts: 'Podcasts',
        videos: 'Videos',
        musicVideos: 'Music Videos',
      },
      playing: 'Playing',
      ready: 'Ready',
      suggestTitle: 'Suggest Content',
      suggestDesc: 'Send us your suggestion or topic for discussion',
      originalLabel: 'Original Content',
    },
    playlist: {
      tracklistTitle: 'Tracklist',
      ofWord: 'of',
      songsCredit: 'tracks by Orlando José Pimentel',
      searchPlaceholder: 'Search tracks...',
      playAll: 'Play All',
      trackLabel: 'Track',
      playingBadge: 'Playing',
      noResults: 'No tracks found for',
      loadingAudio: 'Loading audio...',
      shuffleOn: 'Shuffle On',
      shuffleOff: 'Enable Shuffle',
      prev: 'Previous track',
      next: 'Next track',
      play: 'Play track',
      pause: 'Pause track',
      repeatAll: 'Repeat playlist',
      repeatOne: 'Repeat track',
      repeatOff: 'Repeat off',
      mute: 'Mute',
      unmute: 'Unmute',
      clickToSeek: 'Click to seek',
    },
    news: {
      kicker: 'Regional Journalism',
      autoBadge: 'Auto-Updated',
      title: 'Latest Regional News',
      refresh: 'Refresh',
      loading: 'Loading...',
      readFull: 'Read Full Article',
      readSource: 'Read original source',
      backHome: 'Back',
      sourcePrefix: 'Source',
      editorialRoom: 'WRF Newsroom',
    },
    weather: {
      kicker: 'Local Weather',
      location: 'Figueiró, Amarante',
      syncing: 'Loading weather...',
      feelsLike: 'Feels like',
      clear: 'Clear Sky',
      partlyCloudy: 'Partly Cloudy',
      fog: 'Fog',
      rain: 'Rain',
      snow: 'Snow',
      showers: 'Showers',
      storm: 'Thunderstorm',
      cloudy: 'Cloudy',
    },
    request: {
      kicker: 'Listener Requests',
      title: 'Request Song',
      subtitle: 'Ask for your favorite song',
      whatsapp: 'Request via WhatsApp',
      orSite: 'Or via website',
      artist: 'Artist',
      song: 'Song',
      dedication: 'Dedication',
      name: 'Your Name',
      email: 'Your Email',
      submit: 'Send Request',
    },
    counter: {
      kicker: 'Global Audience',
      activeLabel: 'Active Counter',
      onlineLabel: 'Online',
      caption: 'Listeners and visits synced in real time',
    },
    gallery: {
      kicker: 'Backstage & Events',
      cardTitle: 'Photo Gallery',
      cardDesc: 'Explore studio moments, celebrations, and Figueiró landmarks',
      viewPhotos: 'View Photos',
      modalTitle: 'Photography Gallery',
      close: 'Close',
      all: 'All',
      studio: 'Studio',
      events: 'Events',
      places: 'Places',
      modalFooter: 'Web Rádio Figueiró · Tuned into the Community',
    },
    agenda: {
      kicker: 'Web Rádio Figueiró Exclusive',
      title: 'Cultural Agenda & Events',
      close: 'Close',
      tuning: 'Loading cultural events...',
      unavailableTitle: 'Agenda Temporarily Unavailable',
      unavailableDesc: 'Could not load cultural events right now. Please try again in a moment.',
      reload: 'Reload Agenda',
      viewDetails: 'View Details',
      footer: 'Web Rádio Figueiró · Amarante Cultural Agenda',
    },
    partners: {
      kicker: 'Support Network',
      title: 'Our Partners',
      subtitle: 'Institutions, businesses, and organizations supporting our community broadcast',
    },
    footer: {
      tagline: 'The Voice of the Tâmega Valley · Amarante, Portugal',
      certified: '24/7 Digital Broadcast',
      rights: 'Web Rádio Figueiró. All rights reserved.',
    },
    player: {
      tuning: 'Tuning...',
      live: 'On Air · 320 kbps',
      standby: 'Ready to Play · 24/7',
      copyTitle: 'Copy song title',
      copied: 'Copied!',
      mute: 'Mute',
      unmute: 'Unmute',
      play: 'Listen Live',
      pause: 'Pause',
    },
  },
  es: {
    nav: {
      prog: 'Programación',
      media: 'Multimedia',
      playlist: 'Playlist',
      gallery: 'Galería',
      news: 'Noticias',
      contactBtn: 'Contactar',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      listenLive: 'Escuchar',
      onAir: 'Al Aire',
    },
    ticker: {
      liveLabel: 'Amarante Hoy',
      localLabel: 'WRF Noticias',
      syncing: 'Sincronizando...',
    },
    hero: {
      kicker: 'Figueiró · Amarante · Emisión Digital 24/7',
      title: 'Su Radio en Amarante',
      subtitle: 'Sintonice la mejor música y noticias locales las 24 horas.',
      description: 'La voz de Amarante para el mundo, con emisión digital de alta fidelidad, actualidad regional y la mejor compañía',
      since: 'desde 2022',
      cta: 'Escuchar Ahora',
      pauseCta: 'Pausar Emisión',
      nowPlayingLabel: 'Sonando Ahora',
      qualityLabel: 'Calidad',
      originLabel: 'Origen',
      broadcastLabel: 'Emisión',
      originValue: 'Amarante, PT',
      broadcastValue: '24/7 Online',
    },
    bento: {
      agendaKicker: 'Eventos y Tradición',
      agendaTitle: 'Agenda Cultural',
      agendaDesc: 'Manténgase al día con los eventos culturales, conciertos, fiestas populares e iniciativas en Amarante y el valle del Tâmega.',
      agendaCta: 'Explorar Agenda',
      nextHighlight: 'Próximo Destacado',
      loading: 'Cargando...',
      fallbackEventTitle: 'Jornadas del Patrimonio - Ruta de los Molinos',
      fallbackEventDate: 'Figueiró, Amarante',
      highlightsKicker: 'Emisión Especial',
      highlightsTitle: 'Destacados de la Radio',
      nightGroovesSub: 'Domingos en vivo',
      nightGroovesDesc: '1ª Hora: DJ Durval · 2ª Hora: Invitado',
      prazeresSub: 'Miércoles y Viernes',
      prazeresDesc: 'Crónicas literarias y Música de autor',
      viewFullSchedule: 'Ver Parrilla Completa',
      pharmacyKicker: 'Servicio Público',
      pharmacyTitle: 'Farmacias de Guardia',
      pharmacyDesc: 'Consulte en tiempo real las farmacias de guardia abiertas en la región de Amarante.',
      pharmacyCta: 'Ver Farmacias de Guardia',
      galleryKicker: 'Estudio y Eventos',
      galleryTitle: 'Galería de Fotos',
      galleryDesc: 'Momentos de nuestro equipo, fiestas regionales y rincones de Figueiró.',
      galleryCta: 'Abrir Galería',
    },
    schedule: {
      kicker: 'Parrilla de Emisión',
      title: 'Programación 24/7',
      days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      localTime: 'Hora Local',
      onAir: 'Al Aire',
      timeLabel: 'Horario',
      specialTitle: 'Programas Especiales Destacados',
      sundays: 'Domingos',
      wedFri: 'Miércoles y Viernes',
      nightGroovesDesc: '1ª Hora: DJ Durval · 2ª Hora: DJ Invitado. Lo mejor de la música electrónica y soulful grooves.',
      prazeresDesc: 'Crónicas, literatura y música selecta. Emisión a las 13:00 con repetición a las 20:00.',
      programs: [
        { time: '08:00 - 10:00', start: 8, end: 10, name: 'Mañanas Figueiró', host: 'Música para empezar el día' },
        { time: '10:00 - 13:00', start: 10, end: 13, name: 'Top Hits', host: 'Las más pedidas del momento' },
        { time: '13:00 - 15:00', start: 13, end: 15, name: 'Almuerzo Musical', host: 'Sonidos tranquilos al mediodía' },
        { time: '15:00 - 19:00', start: 15, end: 19, name: 'Tardes en Movimiento', host: 'Energía para el regreso a casa' },
        { time: '19:00 - 08:00', start: 19, end: 32, name: 'Noche Digital', host: 'Música non-stop toda la noche' },
      ],
    },
    media: {
      kicker: 'Multimedia y Música',
      title: 'Explorar Contenidos',
      subtitle: 'Playlist de autor, podcasts, entrevistas y vídeos',
      tabs: {
        playlist: 'Playlist (15)',
        podcasts: 'Podcasts',
        videos: 'Vídeos',
        musicVideos: 'Vídeos Musicales',
      },
      playing: 'Reproduciendo',
      ready: 'Listo',
      suggestTitle: 'Sugerir Contenido',
      suggestDesc: 'Envíanos tu sugerencia o tema para debate',
      originalLabel: 'Contenido Original',
    },
    playlist: {
      tracklistTitle: 'Lista de Pistas',
      ofWord: 'de',
      songsCredit: 'canciones de Orlando José Pimentel',
      searchPlaceholder: 'Buscar música...',
      playAll: 'Reproducir Todas',
      trackLabel: 'Pista',
      playingBadge: 'Sonando',
      noResults: 'No se encontraron canciones para',
      loadingAudio: 'Cargando audio...',
      shuffleOn: 'Modo Aleatorio Activado',
      shuffleOff: 'Activar Modo Aleatorio',
      prev: 'Canción anterior',
      next: 'Siguiente canción',
      play: 'Reproducir canción',
      pause: 'Pausar canción',
      repeatAll: 'Repetir toda la lista',
      repeatOne: 'Repetir esta canción',
      repeatOff: 'Repetición desactivada',
      mute: 'Silenciar',
      unmute: 'Activar sonido',
      clickToSeek: 'Haz clic para avanzar o retroceder',
    },
    news: {
      kicker: 'Periodismo Regional',
      autoBadge: 'Actualización Automática',
      title: 'Últimas Noticias de la Región',
      refresh: 'Actualizar',
      loading: 'Cargando...',
      readFull: 'Leer Noticia Completa',
      readSource: 'Leer en fuente original',
      backHome: 'Volver',
      sourcePrefix: 'Fuente',
      editorialRoom: 'Redacción WRF',
    },
    weather: {
      kicker: 'Tiempo Local',
      location: 'Figueiró, Amarante',
      syncing: 'Cargando tiempo...',
      feelsLike: 'Sensación',
      clear: 'Cielo Despejado',
      partlyCloudy: 'Parcialmente Nublado',
      fog: 'Niebla',
      rain: 'Lluvia',
      snow: 'Nieve',
      showers: 'Chubascos',
      storm: 'Tormenta',
      cloudy: 'Nublado',
    },
    request: {
      kicker: 'Interacción',
      title: 'Pedir Música',
      subtitle: 'Pide tu canción favorita',
      whatsapp: 'Pedir por WhatsApp',
      orSite: 'O por el sitio',
      artist: 'Artista',
      song: 'Canción',
      dedication: 'Dedicatoria',
      name: 'Tu Nombre',
      email: 'Tu Email',
      submit: 'Enviar Pedido',
    },
    counter: {
      kicker: 'Audiencia Global',
      activeLabel: 'Contador Activo',
      onlineLabel: 'En Línea',
      caption: 'Oyentes y visitas sincronizadas en tiempo real',
    },
    gallery: {
      kicker: 'Estudio y Eventos',
      cardTitle: 'Galería de Fotos',
      cardDesc: 'Explora momentos del estudio, fiestas y rincones de Figueiró',
      viewPhotos: 'Ver Fotos',
      modalTitle: 'Galería Fotográfica',
      close: 'Cerrar',
      all: 'Todas',
      studio: 'Estudio',
      events: 'Eventos',
      places: 'Lugares',
      modalFooter: 'Web Rádio Figueiró · Sintonizados con la Comunidad',
    },
    agenda: {
      kicker: 'Exclusivo Web Rádio Figueiró',
      title: 'Agenda Cultural y Eventos',
      close: 'Cerrar',
      tuning: 'Cargando eventos culturales...',
      unavailableTitle: 'Agenda Temporalmente No Disponible',
      unavailableDesc: 'No fue posible cargar los eventos culturales en este momento. Inténtelo de nuevo en unos instantes.',
      reload: 'Recargar Agenda',
      viewDetails: 'Ver Detalles',
      footer: 'Web Rádio Figueiró · Agenda Cultural de Amarante',
    },
    partners: {
      kicker: 'Red de Apoyo',
      title: 'Nuestros Colaboradores',
      subtitle: 'Instituciones, empresas y entidades que fortalecen nuestra emisión comunitaria',
    },
    footer: {
      tagline: 'La Voz del Valle del Tâmega · Amarante, Portugal',
      certified: 'Emisión Digital 24/7',
      rights: 'Web Rádio Figueiró. Todos los derechos reservados.',
    },
    player: {
      tuning: 'Sintonizando...',
      live: 'En Directo · 320 kbps',
      standby: 'Lista para Escuchar · 24/7',
      copyTitle: 'Copiar título de la canción',
      copied: '¡Copiado!',
      mute: 'Silenciar',
      unmute: 'Activar sonido',
      play: 'Escuchar Radio',
      pause: 'Pausar',
    },
  },
  fr: {
    nav: {
      prog: 'Programme',
      media: 'Multimédia',
      playlist: 'Playlist',
      gallery: 'Galerie',
      news: 'Actualités',
      contactBtn: 'Contact',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
      listenLive: 'Écouter',
      onAir: 'À l’Antenne',
    },
    ticker: {
      liveLabel: 'Amarante Aujourd’hui',
      localLabel: 'WRF Infos',
      syncing: 'Synchronisation...',
    },
    hero: {
      kicker: 'Figueiró · Amarante · Diffusion Numérique 24/7',
      title: 'Votre Radio à Amarante',
      subtitle: 'Écoutez la meilleure musique et les nouvelles locales 24h/24.',
      description: 'La voix d’Amarante vers le monde, avec une diffusion numérique haute fidélité, des infos locales et la meilleure compagnie',
      since: 'depuis 2022',
      cta: 'Écouter Maintenant',
      pauseCta: 'Mettre en Pause',
      nowPlayingLabel: 'À l’Antenne',
      qualityLabel: 'Qualité',
      originLabel: 'Origine',
      broadcastLabel: 'Diffusion',
      originValue: 'Amarante, PT',
      broadcastValue: '24/7 En Ligne',
    },
    bento: {
      agendaKicker: 'Événements & Tradition',
      agendaTitle: 'Agenda Culturel',
      agendaDesc: 'Restez informé des événements culturels, concerts, fêtes populaires et initiatives à Amarante et dans la vallée du Tâmega.',
      agendaCta: 'Explorer l’Agenda',
      nextHighlight: 'Prochain Temps Fort',
      loading: 'Chargement...',
      fallbackEventTitle: 'Journées du Patrimoine - Route des Moulins',
      fallbackEventDate: 'Figueiró, Amarante',
      highlightsKicker: 'Émission Spéciale',
      highlightsTitle: 'Temps Forts Radio',
      nightGroovesSub: 'Dimanches en direct',
      nightGroovesDesc: '1re Heure : DJ Durval · 2e Heure : Invité',
      prazeresSub: 'Mercredis et Vendredis',
      prazeresDesc: 'Chroniques littéraires & Musique d’auteur',
      viewFullSchedule: 'Grille Complète',
      pharmacyKicker: 'Service Public',
      pharmacyTitle: 'Pharmacies de Garde',
      pharmacyDesc: 'Consultez en temps réel les pharmacies de garde ouvertes dans la région d’Amarante.',
      pharmacyCta: 'Voir les Pharmacies',
      galleryKicker: 'Studio & Événements',
      galleryTitle: 'Galerie Photo',
      galleryDesc: 'Coulisses du studio, fêtes régionales et paysages de Figueiró.',
      galleryCta: 'Ouvrir la Galerie',
    },
    schedule: {
      kicker: 'Grille des Programmes',
      title: 'Programme 24/7',
      days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      localTime: 'Heure Locale',
      onAir: 'À l’Antenne',
      timeLabel: 'Horaire',
      specialTitle: 'Émissions Spéciales à la Une',
      sundays: 'Dimanches',
      wedFri: 'Mercredis & Vendredis',
      nightGroovesDesc: '1re Heure : DJ Durval · 2e Heure : DJ Invité. Le meilleur de la musique électronique et des soulful grooves.',
      prazeresDesc: 'Chroniques, littérature et sélection musicale. Diffusion à 13h00 et rediffusion à 20h00.',
      programs: [
        { time: '08:00 - 10:00', start: 8, end: 10, name: 'Matins Figueiró', host: 'De la musique pour bien commencer' },
        { time: '10:00 - 13:00', start: 10, end: 13, name: 'Top Hits', host: 'Les titres les plus demandés' },
        { time: '13:00 - 15:00', start: 13, end: 15, name: 'Déjeuner Musical', host: 'Ambiance douce pour la pause midi' },
        { time: '15:00 - 19:00', start: 15, end: 19, name: 'Après-midi en Mouvement', host: 'De l’énergie pour votre retour' },
        { time: '19:00 - 08:00', start: 19, end: 32, name: 'Nuit Numérique', host: 'Musique non-stop toute la nuit' },
      ],
    },
    media: {
      kicker: 'Multimédia & Musique',
      title: 'Explorer les Contenus',
      subtitle: 'Playlist originale, podcasts, entretiens et vidéos',
      tabs: {
        playlist: 'Playlist (15)',
        podcasts: 'Podcasts',
        videos: 'Vidéos',
        musicVideos: 'Clips Musicaux',
      },
      playing: 'En Lecture',
      ready: 'Prêt',
      suggestTitle: 'Suggérer un Contenu',
      suggestDesc: 'Envoyez-nous votre suggestion ou thème de débat',
      originalLabel: 'Contenu Original',
    },
    playlist: {
      tracklistTitle: 'Liste des Titres',
      ofWord: 'sur',
      songsCredit: 'chansons d’Orlando José Pimentel',
      searchPlaceholder: 'Rechercher un titre...',
      playAll: 'Tout Lire',
      trackLabel: 'Piste',
      playingBadge: 'En lecture',
      noResults: 'Aucun titre trouvé pour',
      loadingAudio: 'Chargement audio...',
      shuffleOn: 'Lecture Aléatoire Activée',
      shuffleOff: 'Activer la Lecture Aléatoire',
      prev: 'Piste précédente',
      next: 'Piste suivante',
      play: 'Lire le titre',
      pause: 'Mettre en pause',
      repeatAll: 'Répéter la playlist',
      repeatOne: 'Répéter ce titre',
      repeatOff: 'Répétition désactivée',
      mute: 'Couper le son',
      unmute: 'Rétablir le son',
      clickToSeek: 'Cliquez pour avancer ou reculer',
    },
    news: {
      kicker: 'Journalisme Régional',
      autoBadge: 'Mise à Jour Auto',
      title: 'Dernières Nouvelles Régionales',
      refresh: 'Actualiser',
      loading: 'Chargement...',
      readFull: 'Lire l’Article Complet',
      readSource: 'Lire sur la source',
      backHome: 'Retour',
      sourcePrefix: 'Source',
      editorialRoom: 'Rédaction WRF',
    },
    weather: {
      kicker: 'Météo Locale',
      location: 'Figueiró, Amarante',
      syncing: 'Chargement météo...',
      feelsLike: 'Ressenti',
      clear: 'Ciel Dégagé',
      partlyCloudy: 'Partiellement Nuageux',
      fog: 'Brouillard',
      rain: 'Pluie',
      snow: 'Neige',
      showers: 'Averses',
      storm: 'Orage',
      cloudy: 'Nuageux',
    },
    request: {
      kicker: 'Interaction',
      title: 'Demander un Titre',
      subtitle: 'Demandez votre chanson préférée',
      whatsapp: 'Demander via WhatsApp',
      orSite: 'Ou via le site',
      artist: 'Artiste',
      song: 'Chanson',
      dedication: 'Dédicace',
      name: 'Votre Nom',
      email: 'Votre Email',
      submit: 'Envoyer la demande',
    },
    counter: {
      kicker: 'Audience Mondiale',
      activeLabel: 'Compteur Actif',
      onlineLabel: 'En Ligne',
      caption: 'Auditeurs et visites synchronisés en temps réel',
    },
    gallery: {
      kicker: 'Coulisses & Événements',
      cardTitle: 'Galerie Photo',
      cardDesc: 'Découvrez les moments du studio, les fêtes et les paysages de Figueiró',
      viewPhotos: 'Voir les Photos',
      modalTitle: 'Galerie Photographique',
      close: 'Fermer',
      all: 'Toutes',
      studio: 'Studio',
      events: 'Événements',
      places: 'Lieux',
      modalFooter: 'Web Rádio Figueiró · Connectés à la Communauté',
    },
    agenda: {
      kicker: 'Exclusivité Web Rádio Figueiró',
      title: 'Agenda Culturel & Événements',
      close: 'Fermer',
      tuning: 'Chargement des événements...',
      unavailableTitle: 'Agenda Temporairement Indisponible',
      unavailableDesc: 'Impossible de charger les événements culturels pour le moment. Réessayez dans un instant.',
      reload: 'Recharger l’Agenda',
      viewDetails: 'Voir Détails',
      footer: 'Web Rádio Figueiró · Agenda Culturel d’Amarante',
    },
    partners: {
      kicker: 'Réseau de Soutien',
      title: 'Nos Partenaires',
      subtitle: 'Institutions, entreprises et associations qui soutiennent notre radio communautaire',
    },
    footer: {
      tagline: 'La Voix de la Vallée du Tâmega · Amarante, Portugal',
      certified: 'Diffusion Numérique 24/7',
      rights: 'Web Rádio Figueiró. Tous droits réservés.',
    },
    player: {
      tuning: 'Syntonisation...',
      live: 'En Direct · 320 kbps',
      standby: 'Prêt à Écouter · 24/7',
      copyTitle: 'Copier le titre',
      copied: 'Copié !',
      mute: 'Couper le son',
      unmute: 'Rétablir le son',
      play: 'Écouter la Radio',
      pause: 'Pause',
    },
  },
};
