import mongoose from 'mongoose';
import { UserModel } from '../auth/repository';
import { MenuCommentRepository } from './repository';
import { CommentDto } from './type';

export const MenuCommentService = {
  /**
   * Add a comment or reply
   */
  addComment: async (
    menuId: string,
    userId: string,
    text: string,
    parentId?: string
  ): Promise<CommentDto> => {
    // Validate ObjectIds before proceeding
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid userId format');
    }
    if (!mongoose.Types.ObjectId.isValid(menuId)) {
      throw new Error('Invalid menuId format');
    }
    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      throw new Error('Invalid parentId format');
    }

    const doc = await MenuCommentRepository.add(menuId, userId, text, parentId);

    // fetch user display name
    let userDisplayName = userId;
    const user = (await UserModel.findById(
      new mongoose.Types.ObjectId(userId)
    ).lean()) as {
      _id: mongoose.Types.ObjectId;
      name?: string;
      email?: string;
    } | null;

    if (user) {
      userDisplayName = user.name || user.email || userId;
    }

    return {
      id: String(doc._id),
      user: userDisplayName,
      text: doc.text,
      replies: [],
      createdAt: doc.createdAt
        ? doc.createdAt.toISOString()
        : new Date().toISOString(),
    };
  },

  /**
   * Get all comments for a list of menuIds
   */
  getCommentsForMenus: async (
    menuIds: string[]
  ): Promise<Record<string, CommentDto[]>> => {
    // Validate all menuIds
    const invalidIds = menuIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidIds.length > 0) {
      console.warn('Invalid menuIds:', invalidIds);
      // Filter out invalid IDs instead of throwing
      menuIds = menuIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    }

    if (menuIds.length === 0) {
      return {};
    }

    const commentsByMenu = await MenuCommentRepository.findByMenuIds(menuIds);

    // Resolve user display names for all comments
    const allComments = Object.values(commentsByMenu).flat(2); // flatten nested comments
    const userIds = Array.from(new Set(allComments.map((c: any) => c.user)));

    // Filter valid ObjectIds
    const validUserIds = userIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    const users = await UserModel.find({
      _id: { $in: validUserIds.map((id) => new mongoose.Types.ObjectId(id)) },
    }).lean();

    const userMap = new Map<string, string>();
    users.forEach((u: any) =>
      userMap.set(String(u._id), u.name || u.email || String(u._id))
    );

    // Recursively replace user ids with names
    function replaceUserNames(comments: CommentDto[]): CommentDto[] {
      return comments.map((c) => ({
        ...c,
        user: userMap.get(c.user) || c.user,
        replies: replaceUserNames(c.replies),
      }));
    }

    const result: Record<string, CommentDto[]> = {};
    Object.keys(commentsByMenu).forEach((menuId) => {
      result[menuId] = replaceUserNames(commentsByMenu[menuId]);
    });

    return result;
  },
};
