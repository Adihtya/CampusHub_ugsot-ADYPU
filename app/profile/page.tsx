import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProfileView from '@/components/ProfileView';
import SignOutButton from '@/components/auth/SignOutButton';
import { getCurrentUser } from '@/lib/auth';
import { CURRENT_USER_ID, getStudent } from '@/lib/data';

export const metadata = { title: 'Your profile · CampusHub · UGSOT' };

export default async function MyProfilePage() {
  // Profile details remain demo data until Supabase profiles are added in Phase 5.
  const me = getStudent(CURRENT_USER_ID);
  const currentUser = await getCurrentUser();
  if (!me) notFound();

  return (
    <main className="container page profile-page">
      <div className="profile-page__heading">
        <Link href="/students" className="back-link">← All students</Link>
        <p className="eyebrow">Your CampusHub profile</p>
        <p className="profile-page__note">Give classmates a quick sense of what you’re learning and building.</p>
        {currentUser && <SignOutButton />}
      </div>
      <ProfileView student={me} isOwn />
    </main>
  );
}
