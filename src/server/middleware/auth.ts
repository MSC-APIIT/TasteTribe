import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/server/lib/jwt';

export const authenticateRequest = (req: NextRequest): { userId: string } | NextResponse => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);

  if (!decoded?.sub) {
    return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
  }

  return { userId: decoded.sub };
};
