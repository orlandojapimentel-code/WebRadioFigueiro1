
export interface Program {
  time: string;
  name: string;
  description: string;
}

export interface WeeklyProgram {
  day: string;
  programs: Program[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
