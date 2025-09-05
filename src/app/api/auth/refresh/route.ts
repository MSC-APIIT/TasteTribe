import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken } from '@/server/lib/jwt';
import { findUserById } from '@/server/modules/auth/repository';
import { refreshTokens } from '@/server/modules/auth/service';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('refreshToken')?.value;
    if (!token) throw new Error('No refresh token');

    const payload: any = verifyRefreshToken(token);
    const user = await findUserById(payload.sub);
    if (!user) throw new Error('User not found');

    const tokens = await refreshTokens(user, token);

    const res = NextResponse.json({ accessToken: tokens.accessToken });
    res.cookies.set('refreshToken', tokens.refreshToken, {
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
