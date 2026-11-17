import Link from 'next/link';
import AuthForm from '@/components/auth/AuthForm';

export const metadata = { title: 'Sign in · CampusHub · UGSOT' };

export default function SignInPage() {
  return (
    <div className="auth-content">
      <div className="auth-heading">
        <h1 className="auth-heading__title">Welcome back</h1>
        <p>Sign in with your college account to continue.</p>
      </div>
      <AuthForm mode="sign-in" />
      <div className="auth-links">
        <Link href="/" className="auth-guest">Continue as guest</Link>
      </div>
    </div>
  );
}
