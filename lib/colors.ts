import type { EventType, PostTag } from './types';

/** Soft tint + text colour for chips, and a brighter "sticker" colour for the calendar. */
export const typeColors: Record<EventType, { bg: string; fg: string; sticker: string }> = {
  Hackathon: { bg: '#FFE1EC', fg: '#A3164E', sticker: '#F48A7E' },
  Workshop: { bg: '#FFF3C4', fg: '#6E4B00', sticker: '#F7C948' },
  Contest: { bg: '#E3E9FF', fg: '#2A3FB0', sticker: '#7CC7EC' },
  Meetup: { bg: '#DDF5EA', fg: '#11694A', sticker: '#6CCB95' },
  Sprint: { bg: '#EEE5FF', fg: '#5B2DB0', sticker: '#B49BF2' },
  'Design jam': { bg: '#FFE8D9', fg: '#9A3B0A', sticker: '#F0B7EC' },
};

export const tagColors: Record<PostTag, { bg: string; fg: string }> = {
  'Need help': { bg: '#FFE8D9', fg: '#9A3B0A' },
  Ask: { bg: '#E3E9FF', fg: '#2A3FB0' },
  'Find teammate': { bg: '#DDF5EA', fg: '#11694A' },
  Showcase: { bg: '#EEE5FF', fg: '#5B2DB0' },
};

/** Pastel pairs used for avatars, skills and badges. */
export const pastel = [
  { bg: '#FFF3C4', fg: '#6E4B00' },
  { bg: '#DDF5EA', fg: '#11694A' },
  { bg: '#FFE1EC', fg: '#A3164E' },
  { bg: '#E3E9FF', fg: '#2A3FB0' },
  { bg: '#EEE5FF', fg: '#5B2DB0' },
  { bg: '#FFE8D9', fg: '#9A3B0A' },
];

export const weekdayStripe = ['#F48A7E', '#F7C948', '#6CCB95', '#7CC7EC', '#B49BF2', '#F0B7EC', '#F59A4A'];

export const stickerTilt = ['-2deg', '1.5deg', '-1deg', '2deg'];
