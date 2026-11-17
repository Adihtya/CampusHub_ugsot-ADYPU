import Link from 'next/link';

export const metadata = { title: 'Forgot password · CampusHub · UGSOT' };

export default function ForgotPasswordPage() {
  return (
    <div className="auth-content">
      <div className="auth-heading">
        <h1 className="auth-heading__title">Forgot password?</h1>
        <p>Password recovery will be available when CampusHub connects to its real sign-in service.</p>
      </div>
      <Link href="/auth/sign-in" className="btn btn--primary auth-form__submit">Back to sign in</Link>
    </div>
  );
}
