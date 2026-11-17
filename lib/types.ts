export type EventType = 'event' | 'hackathon';
export type EventCategory = 'Hackathon' | 'Workshop' | 'Contest' | 'Meetup' | 'Sprint' | 'Design jam';
export type EventMode = 'Online' | 'Offline';
export type EventWhere = 'In campus' | 'Out of campus';

interface CampusEventBase {
  id: string;
  title: string;
  type: EventType;
  category: EventCategory;
  mode: EventMode;
  where: EventWhere;
  place: string;
  /** YYYY-MM-DD */
  start: string;
  /** YYYY-MM-DD, for multi-day events */
  end?: string;
  /** YYYY-MM-DD, last day to register */
  registrationDeadline: string;
  capacity: number;
  registerUrl: string;
}

export type CampusEvent = CampusEventBase & (
  | { type: 'event' }
  | {
      type: 'hackathon';
      teamSizeMin: number;
      teamSizeMax: number;
      theme: string;
      prize: string;
      rules: string[];
    }
);

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

export const FORUM_TAGS = [
  'Python',
  'JavaScript',
  'Java',
  'C/C++',
  'Web',
  'AI/ML',
  'DSA',
  'Git',
  'Other',
] as const;

export type ForumTag = (typeof FORUM_TAGS)[number];
export type ForumPostType = 'question' | 'discussion' | 'announcement';

export type ForumPost = {
  id: string;
  type: ForumPostType;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  tags: string[];
  acceptedAnswerId: string | null;
  isReported: boolean;
  createdAt: string;
  updatedAt: string;
  upvotesCount: number;
  answersCount: number;
  hasUpvoted: boolean;
  canDelete: boolean;
};

export type ForumAnswer = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  isAccepted: boolean;
  isReported: boolean;
  createdAt: string;
  updatedAt: string;
  upvotesCount: number;
  hasUpvoted: boolean;
  canDelete: boolean;
  canAccept: boolean;
};

export type Project = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  techStack: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  lookingForCollaborators: boolean;
  rolesNeeded: string[];
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
  hasLiked: boolean;
  hasBookmarked: boolean;
  canEdit: boolean;
};

export type ProjectComment = {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  createdAt: string;
  canDelete: boolean;
};

export type CollaborationRequest = {
  id: string;
  projectId: string;
  projectTitle: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  message: string;
  roleInterested: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
};

export type GitHubRepoStats = {
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
};

export type MentorProfile = {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio: string;
  skills: string[];
  areas: string[];
  availabilitySlots: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export type MentorshipSession = {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorEmail: string;
  menteeId: string;
  menteeName: string;
  menteeEmail: string;
  slot: string;
  date: string;
  topic: string;
  notes: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  createdAt: string;
};

export type CodeReview = {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  title: string;
  githubUrl: string | null;
  codeSnippet: string | null;
  language: string;
  notes: string;
  mentorId: string | null;
  mentorName: string | null;
  feedback: string | null;
  status: 'open' | 'claimed' | 'reviewed' | 'resolved';
  createdAt: string;
};

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

export const OPPORTUNITY_CATEGORIES = [
  'All',
  'Internships',
  'Open-source programs',
  'Hackathons',
  'Fellowships',
  'Competitions',
  'Research',
] as const;

export type OpportunityCategory =
  | 'Internships'
  | 'Open-source programs'
  | 'Hackathons'
  | 'Fellowships'
  | 'Competitions'
  | 'Research';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  description: string;
  link: string;
  deadline: string; // ISO string
  location: string;
  eligibility: string;
  creatorId?: string | null;
  isBookmarked?: boolean;
  isFromEvents?: boolean;
  eventUrl?: string;
  isClosingSoon?: boolean;
  createdAt: string;
}
