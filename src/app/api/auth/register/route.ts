import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/server/modules/auth/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, or password' },
        { status: 400 }
      );
    }

    const user = await registerUser(email, password, name);

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Something went wrong';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}