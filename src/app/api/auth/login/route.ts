import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/server/modules/auth/service';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const { user, accessToken, refreshToken } = await loginUser(
      email,
      password
    );

    const res = NextResponse.json({ user, accessToken });
    res.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/api/auth',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
