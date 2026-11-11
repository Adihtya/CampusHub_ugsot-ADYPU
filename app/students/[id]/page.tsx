import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProfileView from '@/components/ProfileView';
import { CURRENT_USER_ID, getStudent, students } from '@/lib/data';

export function generateStaticParams() {
  return students.map((s) => ({ id: s.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const s = getStudent(params.id);
  return { title: s ? `${s.name} · upGrad DEV CLUB` : 'Student not found · upGrad DEV CLUB' };
}

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const student = getStudent(params.id);
  if (!student) notFound();

  return (
    <main className="container page" style={{ gap: 12 }}>
      <Link href="/students" className="back-link">← All students</Link>
      <ProfileView student={student} isOwn={student.id === CURRENT_USER_ID} />
    </main>
  );
}
