import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/server/middleware/auth';
import { StallService } from '@/server/modules/stall/service';

export async function GET(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const stalls = await StallService.getStallsByProfile(auth.userId);
    return NextResponse.json(stalls);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch stalls' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const payload = await req.json();
    const created = await StallService.createStall(auth.userId, payload);
    return NextResponse.json(created, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create stall' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const stallId = url.searchParams.get('stallId');

  if (!stallId) {
    return NextResponse.json({ error: 'Missing stallId in query' }, { status: 400 });
  }

  try {
    const payload = await req.json();
    const updated = await StallService.updateStall(auth.userId, stallId, payload);

    if (!updated) {
      return NextResponse.json({ error: 'Stall not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update stall' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const stallId = url.searchParams.get('stallId');

  if (!stallId) {
    return NextResponse.json({ error: 'Missing stallId in query' }, { status: 400 });
  }

  try {
    const success = await StallService.deleteStall(auth.userId, stallId);

    if (!success) {
      return NextResponse.json({ error: 'Stall not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete stall' }, { status: 500 });
  }
}
