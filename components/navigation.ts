export const topNavigationItems = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/projects', label: 'Projects' },
  { href: '/community', label: 'Forum' },
  { href: '/mentorship', label: 'Mentorship' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/students', label: 'Students' },
] as const;

export const mobilePrimaryItems = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/projects', label: 'Projects' },
  { href: '/community', label: 'Forum' },
] as const;

export const mobileMoreItems = [
  { href: '/mentorship', label: 'Mentorship' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/students', label: 'Students' },
  { href: '/#feature-suggestions', label: 'Features' },
] as const;

// Backward compatibility
export const navigationItems = topNavigationItems;
