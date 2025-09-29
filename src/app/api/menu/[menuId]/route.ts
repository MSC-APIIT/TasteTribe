import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/server/middleware/auth';
import { MenuService } from '@/server/modules/menu/service';

export async function GET(
  request: NextRequest,
  { params }: { params: { menuId: string } }
) {
  const auth = authenticateRequest(request);

  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const { menuId } = params;

    if (!menuId) {
      return NextResponse.json(
        { error: 'menuId is required' },
        { status: 400 }
      );
    }

    const menuItem = await MenuService.getMenuById(menuId);

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(menuItem);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
