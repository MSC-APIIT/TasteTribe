import { NextRequest, NextResponse } from 'next/server';
import { MenuCommentService } from '@/server/modules/menuComments/service';
import { authenticateRequest } from '@/server/middleware/auth';
import { UserModel } from '@/server/modules/auth/repository';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const menuIds = url.searchParams.getAll('menuId');
    if (!menuIds.length) return NextResponse.json([], { status: 400 });

    const comments = await MenuCommentService.getCommentsForMenus(menuIds);

    // Flatten the record structure to array format
    const allComments: any[] = [];
    Object.keys(comments).forEach((menuId) => {
      comments[menuId].forEach((comment: any) => {
        allComments.push({
          _id: comment.id,
          menuId,
          userName: comment.user,
          text: comment.text,
          createdAt: comment.createdAt || new Date().toISOString(),
          replies: comment.replies.map((reply: any) => ({
            _id: reply.id,
            userName: reply.user,
            text: reply.text,
            createdAt: reply.createdAt || new Date().toISOString(),
          })),
        });
      });
    });

    return NextResponse.json(allComments);
  } catch (err: any) {
    console.error('GET /api/menuComments error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const user = await getCurrentUser(req);
    const { menuId, text, parentId } = await req.json();

    if (!menuId || !text) {
      return NextResponse.json(
        { error: 'menuId and text are required' },
        { status: 400 }
      );
    }

    // Validate that user.id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Validate menuId if needed
    if (!mongoose.Types.ObjectId.isValid(menuId)) {
      return NextResponse.json({ error: 'Invalid menu ID' }, { status: 400 });
    }

    // Validate parentId if provided
    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      return NextResponse.json(
        { error: 'Invalid parent comment ID' },
        { status: 400 }
      );
    }

    const comment = await MenuCommentService.addComment(
      menuId,
      user.id,
      text,
      parentId
    );

    return NextResponse.json(comment);
  } catch (err: any) {
    console.error('POST /api/menuComments error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function getCurrentUser(req: NextRequest) {
  const auth = authenticateRequest(req);
  if (auth instanceof NextResponse) throw new Error('Not authenticated');

  const userId = (auth as { userId: string }).userId;

  // Validate userId is a valid ObjectId before querying
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error('Invalid userId from auth:', userId);
    throw new Error('Invalid user ID format');
  }

  const user = (await UserModel.findById(userId).lean()) as {
    _id: mongoose.Types.ObjectId;
    name?: string;
    email?: string;
  } | null;

  if (!user) {
    console.error('User not found for ID:', userId);
    throw new Error('User not found');
  }

  return {
    id: String(user._id),
    name: user.name || '',
    email: user.email || '',
  };
}
