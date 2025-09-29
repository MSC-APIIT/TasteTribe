import { NextRequest, NextResponse } from 'next/server';
import { MenuService } from '@/server/modules/menu/service';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const popular = await MenuService.getPopularMenus(limit);

    // If you want to return empty array when no ratings exist, this already does.
    return NextResponse.json(popular);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch popular menus' },
      { status: 500 }
    );
  }
}
