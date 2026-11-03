export type EventType = 'Hackathon' | 'Workshop' | 'Contest' | 'Meetup' | 'Sprint' | 'Design jam';
export type EventMode = 'Online' | 'Offline';
export type EventWhere = 'In campus' | 'Out of campus';

export interface CampusEvent {
  id: string;
  title: string;
  type: EventType;
  mode: EventMode;
  where: EventWhere;
  place: string;
  /** YYYY-MM-DD */
  start: string;
  /** YYYY-MM-DD, for multi-day events */
  end?: string;
  /** YYYY-MM-DD, last day to register */
  deadline: string;
  registerUrl: string;
}

export interface Achievement {
  title: string;
  date: string;
  verified?: boolean;
}

export interface Student {
  id: string;
  name: string;
  handle: string;
  branch: string;
  year: string;
  bio: string;
  skills: string[];
  lookingForTeam: boolean;
  links: { linkedin?: string; github?: string; x?: string; portfolio?: string };
  achievements: Achievement[];
  /** ids of events the student is attending */
  going: string[];
  /** 0–100, only shown to the student themselves */
  profileCompleteness: number;
}

export interface Highlight {
  id: string;
  studentId: string;
  text: string;
  badge: string;
}

export type PostTag = 'Need help' | 'Ask' | 'Find teammate' | 'Showcase';

export interface Post {
  id: string;
  tag: PostTag;
  authorId: string;
  /** ISO timestamp */
  createdAt: string;
  title: string;
  body: string;
  score: number;
  replies: number;
  eventId?: string;
}
