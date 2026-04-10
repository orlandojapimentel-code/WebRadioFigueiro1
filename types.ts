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
