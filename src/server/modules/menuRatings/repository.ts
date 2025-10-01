import { connectDb } from '@/server/lib/db';
import mongoose, { Schema } from 'mongoose';

const MenuRatingSchema = new Schema(
  {
    menuId: { type: Schema.Types.ObjectId, ref: 'Menu', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
  },
  { timestamps: true }
);

const MenuRatingModel =
  mongoose.models.MenuRating || mongoose.model('MenuRating', MenuRatingSchema);

export const MenuRatingRepository = {
  addOrUpdate: async (menuId: string, userId: string, rating: number) => {
    await connectDb();
    return MenuRatingModel.findOneAndUpdate(
      { menuId, userId },
      { rating },
      { upsert: true, new: true }
    );
  },

  getStatsForMenu: async (menuId: string) => {
    await connectDb();
    return MenuRatingModel.aggregate([
      { $match: { menuId: new mongoose.Types.ObjectId(menuId) } },
      {
        $group: {
          _id: '$menuId',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 },
        },
      },
    ]);
  },

  getPopularMenus: async () => {
    await connectDb();

    const stats = await MenuRatingModel.aggregate([
      {
        $group: {
          _id: '$menuId',
          ratingCount: { $sum: 1 },
          averageRating: { $avg: '$rating' },
        },
      },
      { $sort: { ratingCount: -1 } },
    ]);

    // If no ratings exist, return all menu IDs with 0 ratings
    if (!stats || stats.length === 0) {
      const MenuModel =
        mongoose.models.Menu || mongoose.model('Menu', new Schema({}));
      const allMenus = await MenuModel.find({}).select('_id').lean();

      return allMenus.map((menu: any) => ({
        _id: menu._id,
        ratingCount: 0,
        averageRating: 0,
      }));
    }

    return stats;
  },

  getUserRating: async (
    menuId: string,
    userId: string
  ): Promise<{ rating: number } | null> => {
    await connectDb();
    return MenuRatingModel.findOne({ menuId, userId })
      .select('rating')
      .lean<{ rating: number }>()
      .exec();
  },

  getMenuStats: async (menuIds: string[]) => {
    await connectDb();
    return await MenuRatingModel.aggregate([
      {
        $match: {
          menuId: { $in: menuIds.map((id) => new mongoose.Types.ObjectId(id)) },
        },
      },
      {
        $group: {
          _id: '$menuId',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 },
        },
      },
    ]);
  },
};
