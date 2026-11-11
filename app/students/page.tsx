import PageHero from '@/components/PageHero';
import StudentsBrowser from '@/components/StudentsBrowser';
import { students } from '@/lib/data';

export const metadata = { title: 'Students · upGrad DEV CLUB' };

export default function StudentsPage() {
  return (
    <main className="container page">
      <PageHero
        tag="Builders on campus"
        tagColor={{ bg: '#FFFFFF', fg: '#1F1F1F' }}
        before="Find your "
        highlight="squad"
        sub="Search classmates by skill, and see who’s looking for a team."
      />
      <StudentsBrowser students={students} />
    </main>
  );
}
