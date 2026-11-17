import { NextResponse } from 'next/server';
import { signUp } from '@/lib/auth';
import { isStringRecord, validateSignUp } from '@/lib/validation';

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!isStringRecord(body)) {
    return NextResponse.json({ form: 'Check the details and try again.' }, { status: 400 });
  }
  const { name, email, password, confirmPassword, courseYear } = body;
  if (!name || !email || !password || !confirmPassword || !courseYear) {
    return NextResponse.json({ form: 'Complete each field to create your account.' }, { status: 400 });
  }

  const errors = validateSignUp({ name, email, password, confirmPassword, courseYear });
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 });

  await signUp(name, email);
  return NextResponse.json({ success: true });
}
