import { pastel } from '@/lib/colors';
import { studentIndex } from '@/lib/data';

export function initialsOf(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function Avatar({ studentId, name, size = 'md' }: { studentId: string; name: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const c = pastel[studentIndex(studentId) % pastel.length];
  return (
    <span aria-hidden="true" className={`avatar avatar--${size}`} style={{ background: c.bg, color: c.fg }}>
      {initialsOf(name)}
    </span>
  );
}
