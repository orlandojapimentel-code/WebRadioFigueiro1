export interface Track {
  id: string;
  title: string;
  artist: string;
  time: string;
  cover?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string;
}

export interface ScheduleItem {
  time: string;
  program: string;
  host: string;
}

export interface PlaylistItem {
  id: string;
  number: number;
  title: string;
  artist: string;
  audioUrl: string;
  originalUrl: string;
  format: 'MP3' | 'FLAC';
  tag: string;
}
