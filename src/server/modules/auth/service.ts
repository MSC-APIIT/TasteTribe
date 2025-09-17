import {
  createUser,
  findUserByEmail,
  setRefreshToken,
  verifyRefreshTokenHash,
  validatePassword,
} from './repository';
import { signAccessToken, signRefreshToken } from '@/server/lib/jwt';
import { UserDto } from './types';
import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '../../lib/db';
import { verifyAccessToken } from '../../lib/jwt';


export const registerUser = async (
  email: string,
  password: string,
  name?: string
): Promise<UserDto> => {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error('Email already registered');
  const user = await createUser(email, password, name);
  return { id: user._id.toString(), email: user.email, name: user.name };
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('Invalid credentials');
  const ok = await validatePassword(user, password);
  if (!ok) throw new Error('Invalid credentials');

  const accessToken = signAccessToken({ sub: user._id, email: user.email });
  const refreshToken = signRefreshToken({ sub: user._id });

  await setRefreshToken(user._id, refreshToken);

  return {
    user: { id: user._id.toString(), email: user.email, name: user.name },
    accessToken,
    refreshToken,
  };
};

export const refreshTokens = async (user: any, token: string) => {
  const valid = await verifyRefreshTokenHash(user, token);
  if (!valid) throw new Error('Invalid refresh token');

  const accessToken = signAccessToken({ sub: user._id, email: user.email });
  const refreshToken = signRefreshToken({ sub: user._id });
  await setRefreshToken(user._id, refreshToken);

  return { accessToken, refreshToken };
};

export async function authenticateRequest(req: NextRequest): Promise<{ userId: string } | NextResponse> {
  await connectDb();

  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  let decoded: any;

  try {
    decoded = verifyAccessToken(token);
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  const userId = decoded?.sub;
  if (!userId) {
    return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
  }

  return { userId };
}
