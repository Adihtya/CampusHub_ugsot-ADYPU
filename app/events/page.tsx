import PageHero from '@/components/PageHero';
import EventsBrowser from '@/components/EventsBrowser';
import { Plus } from '@/components/icons';
import { events } from '@/lib/data';
import { todayISO } from '@/lib/dates';

export const metadata = { title: 'Events · upGrad DEV CLUB' };

export default function EventsPage() {
  return (
    <main className="container page">
      <PageHero
        tag="Hack · Learn · Win"
        tagColor={{ bg: '#DEA043', fg: '#1F1F1F' }}
        before="All the "
        highlight="events"
        sub="Hackathons, workshops and contests, on campus and beyond."
        action={<button type="button" className="btn btn--primary"><Plus />Submit an event</button>}
      />
      <EventsBrowser events={events} today={todayISO()} />
    </main>
  );
}
