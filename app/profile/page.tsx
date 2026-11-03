import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProfileView from '@/components/ProfileView';
import { CURRENT_USER_ID, getStudent } from '@/lib/data';

export const metadata = { title: 'Your profile · UGSOTADYPU Hub' };

export default function MyProfilePage() {
  // Replace with the signed-in user once auth is added.
  const me = getStudent(CURRENT_USER_ID);
  if (!me) notFound();

  return (
    <main className="container page" style={{ gap: 12 }}>
      <Link href="/students" className="back-link">← All students</Link>
      <ProfileView student={me} isOwn />
    </main>
  );
}
