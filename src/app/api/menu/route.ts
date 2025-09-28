import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/server/middleware/auth';
import { MenuService } from '@/server/modules/menu/service';
import { uploadToCloudinary } from '@/server/middleware/upload';

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

export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await req.formData();
    const stallId = formData.get('stallId') as string; // GET stallId from form
    if (!stallId) {
      return NextResponse.json(
        { error: 'stallId is required' },
        { status: 400 }
      );
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const files = formData.getAll('images') as File[];

    let uploadedUrls: string[] = [];
    if (files.length) {
      const uploads = files.map((file) => uploadToCloudinary(file));
      const results = await Promise.all(uploads);
      uploadedUrls = results.map((r) => r.secure_url);
    }

    const menu = await MenuService.createMenu(stallId, {
      name,
      description,
      price,
      images: uploadedUrls,
    });

    return NextResponse.json(menu, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await req.formData();
    const menuId = formData.get('menuId') as string; // read menuId from body
    if (!menuId)
      return NextResponse.json({ error: 'menuId required' }, { status: 400 });

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const files = formData.getAll('images') as File[];

    let uploadedUrls: string[] = [];
    if (files.length) {
      const uploads = files.map((file) => uploadToCloudinary(file));
      const results = await Promise.all(uploads);
      uploadedUrls = results.map((r) => r.secure_url);
    }

    const currentMenu = await MenuService.getMenuById(menuId);
    if (!currentMenu)
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 });

    const updated = await MenuService.updateMenu(menuId, {
      name,
      description,
      price,
      images: uploadedUrls.length ? uploadedUrls : currentMenu.images,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
