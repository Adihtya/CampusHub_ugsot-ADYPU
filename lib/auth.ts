// DEMO ONLY: replaced by Supabase auth in Phase 5. Not secure.
import { cookies } from 'next/headers';

const COOKIE_NAME = 'campushub-demo-user';

export type CurrentUser = { name: string; email: string };

async function saveUser(name: string, email: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, encodeURIComponent(JSON.stringify({ name, email })), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

export async function signIn(email: string) {
  const displayName = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  await saveUser(displayName, email.trim().toLowerCase());
}

export async function signUp(name: string, email: string) {
  await saveUser(name.trim(), email.trim().toLowerCase());
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return null;
  try {
    const user: unknown = JSON.parse(decodeURIComponent(value));
    if (
      typeof user === 'object' && user !== null
      && 'name' in user && typeof user.name === 'string'
      && 'email' in user && typeof user.email === 'string'
    ) return { name: user.name, email: user.email };
  } catch (error) {
    console.error('Unable to read the demo auth session cookie.', error);
  }
  return null;
}
