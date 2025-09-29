import { connectDb } from '@/server/lib/db';
import mongoose, { Schema, Model } from 'mongoose';
import { CommentDto } from './type';

// Basic comment schema: userId is stored; we'll resolve display name below
const MenuCommentSchema = new Schema(
  {
    menuId: { type: Schema.Types.ObjectId, ref: 'Menu', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'MenuComment',
      default: null,
    },
  },
  { timestamps: true }
);

const MenuCommentModel: Model<any> =
  mongoose.models.MenuComment ||
  mongoose.model('MenuComment', MenuCommentSchema);

const UserModel: Model<any> | null = mongoose.models.User || null;

export const MenuCommentRepository = {
  add: async (
    menuId: string,
    userId: string,
    text: string,
    parentId?: string
  ) => {
    await connectDb();
    return MenuCommentModel.create({
      menuId,
      userId,
      text,
      parentId: parentId || null,
    });
  },

  /**
   * Fetch comments for multiple menuIds and return nested structure grouped by menuId.
   * Return shape: Record<menuId, CommentDto[]>
   */
  findByMenuIds: async (menuIds: string[]) => {
    await connectDb();
    if (!menuIds || menuIds.length === 0) return {};

    const docs = await MenuCommentModel.find({
      menuId: { $in: menuIds.map((id) => new mongoose.Types.ObjectId(id)) },
    })
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    const userIds = Array.from(new Set(docs.map((d: any) => String(d.userId))));
    const userMap = new Map<string, string>();

    if (UserModel) {
      const users = await UserModel.find({ _id: { $in: userIds } })
        .lean()
        .exec();
      users.forEach((u: any) =>
        userMap.set(String(u._id), u.displayName || u.name || String(u._id))
      );
    } else {
      userIds.forEach((id) => userMap.set(id, id));
    }

    const grouped: Record<string, any[]> = {};
    docs.forEach((c: any) => {
      const menuIdStr = String(c.menuId);
      if (!grouped[menuIdStr]) grouped[menuIdStr] = [];
      grouped[menuIdStr].push(c);
    });

    const result: Record<string, CommentDto[]> = {};
    Object.keys(grouped).forEach((menuId) => {
      result[menuId] = nestComments(grouped[menuId], userMap);
    });

    return result;
  },
};

function nestComments(raw: any[], userMap: Map<string, string>): CommentDto[] {
  const map = new Map<string, CommentDto & { parentId: string | null }>();

  raw.forEach((c) => {
    map.set(String(c._id), {
      id: String(c._id),
      user: userMap.get(String(c.userId)) || String(c.userId),
      text: c.text,
      replies: [],
      parentId: c.parentId ? String(c.parentId) : null,
    });
  });

  const roots: CommentDto[] = [];
  Array.from(map.values()).forEach((node) => {
    if (node.parentId) {
      const parent = map.get(node.parentId);
      if (parent) {
        parent.replies.push(node as CommentDto);
      } else {
        roots.push(node as CommentDto);
      }
    } else {
      roots.push(node as CommentDto);
    }
  });

  return roots;
}
