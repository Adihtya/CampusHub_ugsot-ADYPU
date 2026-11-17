'use client';

import { useState, type FormEvent } from 'react';

export default function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} style={{ gap: 16 }}>
      <div className="field">
        <label className="field__label" htmlFor="reset-email">College email</label>
        <input id="reset-email" type="email" className="input" placeholder="you@adypu.edu.in" required />
      </div>
      {submitted && (
        <p className="form-success" role="status">
          If an account exists for that email, we’ve sent instructions to reset your password.
        </p>
      )}
      <button type="submit" className="btn btn--primary auth-form__submit">
        Send reset instructions
      </button>
    </form>
  );
}
