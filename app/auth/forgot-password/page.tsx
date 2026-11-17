import Link from 'next/link';

export const metadata = { title: 'Forgot password · CampusHub · UGSOT' };

export default function ForgotPasswordPage() {
  return (
    <div className="auth-content">
      <div className="auth-heading">
        <h1 className="auth-heading__title">Reset your password</h1>
        <p>Enter your ADYPU college email address and we’ll help you regain access to your account.</p>
      </div>
      <form className="auth-form" onSubmit={(e) => e.preventDefault()} style={{ gap: 16 }}>
        <div className="field">
          <label className="field__label" htmlFor="reset-email">College email</label>
          <input id="reset-email" type="email" className="input" placeholder="you@adypu.edu.in" required />
        </div>
        <button type="submit" className="btn btn--primary auth-form__submit">
          Send reset instructions
        </button>
      </form>
      <div className="auth-links">
        <Link href="/auth/sign-in" className="auth-guest">← Back to sign in</Link>
      </div>
    </div>
  );
}
