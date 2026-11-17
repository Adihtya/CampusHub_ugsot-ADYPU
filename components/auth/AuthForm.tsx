'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { isStringRecord, validateSignIn, validateSignUp, type AuthErrors } from '@/lib/validation';

type Mode = 'sign-in' | 'register';
type Fields = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  courseYear: string;
};
type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  autoComplete: string;
  error?: string;
  onChange: (value: string) => void;
};

const COURSE_YEARS = [
  'CSE · 1st year', 'CSE · 2nd year', 'CSE · 3rd year', 'CSE · 4th year',
  'AI & DS · 1st year', 'AI & DS · 2nd year', 'AI & DS · 3rd year', 'AI & DS · 4th year',
  'IT · 1st year', 'IT · 2nd year', 'IT · 3rd year', 'IT · 4th year',
];

function PasswordField({ id, label, value, autoComplete, error, onChange }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const errorId = `${id}-error`;
  return (
    <div className="auth-field">
      <div className="field">
        <label className="field__label" htmlFor={id}>{label}</label>
        <span className="auth-password">
          <input id={id} className="input" type={visible ? 'text' : 'password'} value={value}
            autoComplete={autoComplete} onChange={(event) => onChange(event.target.value)}
            aria-invalid={!!error} aria-describedby={error ? errorId : undefined} required />
          <button type="button" className="auth-password__toggle" aria-pressed={visible}
            aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible((show) => !show)}>
            {visible ? 'Hide' : 'Show'}
          </button>
        </span>
      </div>
      {error && <span id={errorId} className="form-error">{error}</span>}
    </div>
  );
}

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState(mode);
  const registering = activeMode === 'register';
  const [values, setValues] = useState<Fields>({
    name: '', email: '', password: '', confirmPassword: '', courseYear: '',
  });
  const [errors, setErrors] = useState<AuthErrors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof Fields, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
    setFormError('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = registering
      ? validateSignUp(values)
      : validateSignIn({ email: values.email, password: values.password });
    setErrors(validation);
    setFormError('');
    if (Object.keys(validation).length) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/auth/${registering ? 'register' : 'sign-in'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const payload: unknown = await response.json();
      if (!response.ok) {
        if (typeof payload === 'object' && payload !== null) {
          const result = payload as { errors?: unknown; form?: unknown };
          if (isStringRecord(result.errors)) setErrors(result.errors);
          if (typeof result.form === 'string') setFormError(result.form);
        } else {
          setFormError('We couldn’t complete that request. Please try again.');
        }
        return;
      }
      router.replace('/');
      router.refresh();
    } catch {
      setFormError('We couldn’t reach CampusHub. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-panel">
      <div className="auth-tabs" role="tablist" aria-label="Account access">
        <button id="auth-tab-login" className={registering ? 'auth-tab' : 'auth-tab auth-tab--active'}
          type="button" role="tab" aria-selected={!registering} aria-controls="auth-form"
          onClick={() => { setActiveMode('sign-in'); setErrors({}); setFormError(''); }}>
          Login
        </button>
        <button id="auth-tab-register" className={registering ? 'auth-tab auth-tab--active' : 'auth-tab'}
          type="button" role="tab" aria-selected={registering} aria-controls="auth-form"
          onClick={() => { setActiveMode('register'); setErrors({}); setFormError(''); }}>
          Register
        </button>
      </div>
      <form id="auth-form" className="auth-form" role="tabpanel"
        aria-labelledby={registering ? 'auth-tab-register' : 'auth-tab-login'}
        onSubmit={submit} noValidate>
      {registering && (
        <AuthTextField id="auth-name" label="Full name" value={values.name} autoComplete="name"
          error={errors.name} onChange={(value) => update('name', value)} />
      )}
      <AuthTextField id="auth-email" label="College email" type="email" value={values.email}
        autoComplete="email" placeholder="you@adypu.edu.in" error={errors.email}
        onChange={(value) => update('email', value)} />
      <PasswordField id="auth-password" label="Password" value={values.password}
        autoComplete={registering ? 'new-password' : 'current-password'} error={errors.password}
        onChange={(value) => update('password', value)} />
      {registering && (
        <>
          <PasswordField id="auth-confirm-password" label="Confirm password" value={values.confirmPassword}
            autoComplete="new-password" error={errors.confirmPassword}
            onChange={(value) => update('confirmPassword', value)} />
          <div className="auth-field">
            <label className="field" htmlFor="auth-course-year">
              <span className="field__label">Course and year</span>
              <select id="auth-course-year" className="input" value={values.courseYear}
                onChange={(event) => update('courseYear', event.target.value)}
                aria-invalid={!!errors.courseYear} aria-describedby={errors.courseYear ? 'auth-course-year-error' : undefined}
                autoComplete="off" required>
                <option value="">Choose your course and year</option>
                {COURSE_YEARS.map((courseYear) => <option key={courseYear}>{courseYear}</option>)}
              </select>
            </label>
            {errors.courseYear && <span id="auth-course-year-error" className="form-error">{errors.courseYear}</span>}
          </div>
        </>
      )}
      {formError && <p className="form-error" role="alert">{formError}</p>}
      {!registering && (
        <Link href="/auth/forgot-password" className="auth-form__forgot">Forgot password?</Link>
      )}
      <button className="btn btn--primary auth-form__submit" type="submit" disabled={submitting}>
        {submitting ? (registering ? 'Creating account…' : 'Signing in…') : (registering ? 'Create account' : 'Sign in')}
      </button>
        </form>
      </div>
  );
}

function AuthTextField({
  id, label, type = 'text', value, autoComplete, placeholder, error, onChange,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  autoComplete: string;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="auth-field">
      <label className="field" htmlFor={id}>
        <span className="field__label">{label}</span>
        <input id={id} className="input" type={type} value={value} autoComplete={autoComplete}
          placeholder={placeholder} onChange={(event) => onChange(event.target.value)}
          aria-invalid={!!error} aria-describedby={error ? errorId : undefined} required />
      </label>
      {error && <span id={errorId} className="form-error">{error}</span>}
    </div>
  );
}
