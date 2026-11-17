import { NextResponse } from 'next/server';
import { signIn } from '@/lib/auth';
import { isStringRecord, validateSignIn } from '@/lib/validation';

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!isStringRecord(body) || typeof body.email !== 'string' || typeof body.password !== 'string') {
    return NextResponse.json({ form: 'Enter your college email and password.' }, { status: 400 });
  }

  const errors = validateSignIn({ email: body.email, password: body.password });
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 });

  await signIn(body.email);
  return NextResponse.json({ success: true });
}
