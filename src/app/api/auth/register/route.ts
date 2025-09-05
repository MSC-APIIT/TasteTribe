import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/server/modules/auth/service';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    const user = await registerUser(email, password, name);
    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
