import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase/server';

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'organizer';
  githubUsername?: string | null;
  skills?: string[];
  bio?: string | null;
  courseYear?: string | null;
};

export class AuthServiceError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

export async function signIn(email: string, password: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) {
    throw new AuthServiceError('Email or password is incorrect. Please try again.', 400);
  }
}

export async function signUp(name: string, email: string, password: string, courseYear: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: { full_name: name.trim(), course_year: courseYear },
    },
  });
  if (error) {
    const alreadyRegistered = /already (?:been )?registered|already exists/i.test(error.message);
    throw new AuthServiceError(
      alreadyRegistered ? 'An account with this email already exists. Try signing in.' : 'We couldn’t create your account. Check your details and try again.',
      400,
    );
  }
  return { confirmationRequired: data.session === null };
}

export async function signOut() {
  if (!isSupabaseConfigured()) return;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new AuthServiceError('We couldn’t sign you out. Please try again.', 500);
}

export async function requestPasswordReset(email: string, redirectTo?: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo,
  });
  if (error) {
    throw new AuthServiceError('We couldn’t send reset instructions. Check the email and try again.', 400);
  }
}

export async function updatePassword(password: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    throw new AuthServiceError('We couldn’t update your password. Please try again.', 400);
  }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) {
    if (authError.status === 401 || authError.name === 'AuthSessionMissingError') return null;
    throw new Error(`Unable to verify the signed-in user: ${authError.message}`);
  }
  if (!authData.user?.email) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('full_name, role, github_username, skills, bio, course_year')
    .eq('id', authData.user.id)
    .maybeSingle();
  if (error) {
    console.warn(`Unable to load the signed-in profile: ${error.message}`);
  }

  const name = profile?.full_name || authData.user.user_metadata?.full_name;
  return {
    id: authData.user.id,
    name: typeof name === 'string' && name.trim() ? name : authData.user.email.split('@')[0],
    email: authData.user.email,
    role: profile?.role ?? 'student',
    githubUsername: profile?.github_username || null,
    skills: profile?.skills ?? [],
    bio: profile?.bio || null,
    courseYear: profile?.course_year || null,
  };
}
