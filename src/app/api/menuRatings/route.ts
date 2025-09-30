import { NextRequest, NextResponse } from 'next/server';
import { MenuRatingService } from '@/server/modules/menuRatings/service';
import { authenticateRequest } from '@/server/middleware/auth';

export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { menuId, rating } = await req.json();
    if (!menuId || !rating) {
      return NextResponse.json(
        { error: 'menuId and rating required' },
        { status: 400 }
      );
    }

    const updated = await MenuRatingService.rateMenu(
      menuId,
      auth.userId,
      rating
    );
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const menuId = searchParams.get('menuId');
  if (!menuId) {
    return NextResponse.json({ error: 'menuId is required' }, { status: 400 });
  }

  const auth = authenticateRequest(req);
  const userId = auth instanceof NextResponse ? undefined : auth.userId;

  try {
    const result = await MenuRatingService.getMenuRating(menuId, userId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
