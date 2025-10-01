import { NextRequest, NextResponse } from 'next/server';
import { MenuService } from '@/server/modules/menu/service';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const queryParam = url.searchParams.get('query');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    let result;

    if (queryParam && queryParam.trim()) {
      // Search behavior
      result = await MenuService.searchMenus(queryParam, limit || 10);
    } else {
      // default popular behavior
      result = await MenuService.getPopularMenus(limit);
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch popular menus' },
      { status: 500 }
    );
  }
}
