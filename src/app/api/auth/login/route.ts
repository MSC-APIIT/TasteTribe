import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/server/modules/auth/service';
import { UserDto } from '@/server/modules/auth/types';

// Make sure OPTIONS is exported properly
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const { user, accessToken, refreshToken } = await loginUser(
      email,
      password
    );

    const response = NextResponse.json({
      user: user as UserDto,
      accessToken,
    });

    response.cookies.set({
      name: 'refreshToken',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
