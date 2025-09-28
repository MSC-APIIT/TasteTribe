import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/server/middleware/auth';
import { MenuService } from '@/server/modules/menu/service';

export async function GET(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const stallId = searchParams.get('stallId');

    if (!stallId) {
      return NextResponse.json(
        { error: 'stallId is required' },
        { status: 400 }
      );
    }

    const menus = await MenuService.getMenusByStall(stallId);
    return NextResponse.json(menus);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { menuId: string } }
) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const deleted = await MenuService.deleteMenu(params.menuId);
    if (!deleted)
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
    return NextResponse.json({ message: 'Menu deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
