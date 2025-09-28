import { NextRequest, NextResponse } from 'next/server';
import { StallService } from '@/server/modules/stall/service';
import { authenticateRequest } from '@/server/middleware/auth';
import { StallRepository } from '@/server/modules/stall/repository';

export async function GET(
  request: NextRequest,
  { params }: { params: { stallId: string } }
) {
  const auth = authenticateRequest(request);

  if (auth instanceof NextResponse) {
    return auth;
  }

  const { stallId } = params;

  try {
    const stall = await StallRepository.getStallByIdForProfile(auth.userId,stallId);

    if (!stall) {
      return NextResponse.json({ message: 'Stall not found' }, { status: 404 });
    }

    return NextResponse.json(stall);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch stall' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { stallId: string } }
) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  const { stallId } = params;

  if (!stallId) {
    return NextResponse.json({ error: 'Missing stallId in path' }, { status: 400 });
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