import { verifyAccessToken } from '@/server/lib/jwt';

export const requireAuth = (req: Request) => {
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace('Bearer ', '');
  if (!token) throw new Error('Unauthorized');
  return verifyAccessToken(token); // returns payload
};
