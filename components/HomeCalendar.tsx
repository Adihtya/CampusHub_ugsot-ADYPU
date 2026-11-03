'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { CampusEvent } from '@/lib/types';
import { eventDays, formatShort, parseDate, toISO } from '@/lib/dates';
import Calendar from './Calendar';
import FilterPills from './FilterPills';
import EventDateBlock from './EventDateBlock';

const FILTERS = ['All', 'Online', 'Offline', 'In campus', 'Out of campus'] as const;
type Filter = (typeof FILTERS)[number];

export default function HomeCalendar({ events, today }: { events: CampusEvent[]; today: string }) {
  const [filter, setFilter] = useState<Filter>('All');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(
    () => events.filter((e) => filter === 'All' || e.mode === filter || e.where === filter),
    [events, filter],
  );

  const agenda = useMemo(() => {
    if (selected) return filtered.filter((e) => eventDays(e).some((d) => toISO(d) === selected));
    const now = parseDate(today);
    return filtered
      .filter((e) => parseDate(e.end ?? e.start) >= now)
      .sort((a, b) => a.start.localeCompare(b.start))
      .slice(0, 3);
  }, [filtered, selected, today]);

  return (
    <Calendar
      events={filtered}
      today={today}
      selected={selected}
      onSelect={setSelected}
      toolbar={<FilterPills label="Filter events" options={FILTERS} value={filter} onChange={setFilter} />}
      footer={
        <div className="agenda">
          <div className="section-head">
            <h3 className="agenda__title">{selected ? `On ${formatShort(selected)}` : 'Coming up next'}</h3>
            <Link href="/events" className="link-more">All events →</Link>
          </div>
          {agenda.map((e) => (
            <div key={e.id} className="agenda__item">
              <EventDateBlock event={e} />
              <div className="agenda__info">
                <div className="agenda__name">{e.title}</div>
                <div className="agenda__meta">{e.type} · {e.mode} · {e.where}</div>
              </div>
              <span className="chip chip--deadline">Closes {formatShort(e.deadline)}</span>
              <a href={e.registerUrl} className="btn btn--dark">Register</a>
            </div>
          ))}
          {agenda.length === 0 && (
            <p className="agenda__empty">{selected ? 'Nothing planned for this day yet.' : 'No upcoming events match this filter.'}</p>
          )}
        </div>
      }
    />
  );
}
