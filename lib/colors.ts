import type { EventType, PostTag } from './types';

/** Brand-safe text pairs for chips, and brand accents for the calendar. */
export const typeColors: Record<EventType, { bg: string; fg: string; sticker: string }> = {
  Hackathon: { bg: '#0C0E38', fg: '#FFFFFF', sticker: '#DEA043' },
  Workshop: { bg: '#DEA043', fg: '#1F1F1F', sticker: '#DEA043' },
  Contest: { bg: '#FFFFFF', fg: '#1F1F1F', sticker: '#DEA043' },
  Meetup: { bg: '#FFFFFF', fg: '#1F1F1F', sticker: '#DEA043' },
  Sprint: { bg: '#0C0E38', fg: '#FFFFFF', sticker: '#DEA043' },
  'Design jam': { bg: '#FFFFFF', fg: '#1F1F1F', sticker: '#DEA043' },
};

export const tagColors: Record<PostTag, { bg: string; fg: string }> = {
  'Need help': { bg: '#DEA043', fg: '#1F1F1F' },
  Ask: { bg: '#FFFFFF', fg: '#1F1F1F' },
  'Find teammate': { bg: '#0C0E38', fg: '#FFFFFF' },
  Showcase: { bg: '#FFFFFF', fg: '#1F1F1F' },
};

/** Brand palette pairs used for avatars, skills and badges. */
export const pastel = [
  { bg: '#DEA043', fg: '#1F1F1F' },
  { bg: '#0C0E38', fg: '#FFFFFF' },
  { bg: '#FFFFFF', fg: '#1F1F1F' },
  { bg: '#FFFFFF', fg: '#1F1F1F' },
];

export const weekdayStripe = ['#EE2C3C', '#DEA043', '#0C0E38', '#EE2C3C', '#DEA043', '#0C0E38', '#EE2C3C'];

export const stickerTilt = ['-2deg', '1.5deg', '-1deg', '2deg'];
