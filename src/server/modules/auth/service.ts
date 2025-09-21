import {
  createUser,
  findUserByEmail,
  setRefreshToken,
  verifyRefreshTokenHash,
  validatePassword,
} from './repository';
import { signAccessToken, signRefreshToken } from '@/server/lib/jwt';
import { UserDto } from './types';


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
