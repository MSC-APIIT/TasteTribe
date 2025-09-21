import { NextResponse } from 'next/server';
import { connectDb } from '@/server/lib/db';

export async function GET() {
  try {
    const conn = await connectDb();
    // conn.connection.readyState:
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    return NextResponse.json({
      status: 'ok',
      readyState: conn.connection.readyState,
    });
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({ message: 'POST is working' });
}
