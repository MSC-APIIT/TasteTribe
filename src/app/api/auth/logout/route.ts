import { NextRequest, NextResponse } from 'next/server';
import {
  findUserById,
  setRefreshToken,
} from '@/server/modules/auth/repository';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('refreshToken')?.value;
    if (token) {
      const payload: any = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );
      const user = await findUserById(payload.sub);
      if (user) await setRefreshToken(user._id, '');
    }
    const res = NextResponse.json({ success: true });
    res.cookies.delete({ name: 'refreshToken', path: '/api/auth' });
    return res;
  } catch {
    return NextResponse.json({ success: true });
  }
}
