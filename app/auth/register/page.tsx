import AuthForm from '@/components/auth/AuthForm';

export const metadata = { title: 'Create account · CampusHub · UGSOT' };

export default function RegisterPage() {
  return (
    <div className="auth-content">
      <div className="auth-heading">
        <h1 className="auth-heading__title">Join CampusHub</h1>
        <p>Create your student account to get started.</p>
      </div>
      <AuthForm mode="register" />
    </div>
  );
}
