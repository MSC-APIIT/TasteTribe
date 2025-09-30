import { connectDb } from '@/server/lib/db';
import mongoose, { Schema } from 'mongoose';
import { MenuItemDto } from './type';

const MenuSchema = new Schema(
  {
    stallId: { type: Schema.Types.ObjectId, ref: 'Stall', required: true },
    name: String,
    description: String,
    price: Number,
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const MenuModel = mongoose.models.Menu || mongoose.model('Menu', MenuSchema);

export const MenuRepository = {
  create: async (data: MenuItemDto) => {
    await connectDb();
    return MenuModel.create(data);
  },

  updateById: async (menuId: string, updates: Partial<MenuItemDto>) => {
    await connectDb();
    return MenuModel.findByIdAndUpdate(menuId, updates, { new: true });
  },

  deleteById: async (menuId: string) => {
    await connectDb();
    return MenuModel.findByIdAndDelete(menuId);
  },

  findById: async (menuId: string) => {
    await connectDb();
    return MenuModel.findById(menuId);
  },

  findAllByStallId: async (stallId: string) => {
    await connectDb();
    return MenuModel.find({ stallId });
  },

  findByIds: async (ids: string[]) => {
    await connectDb();
    if (!ids || ids.length === 0) return [];
    const docs = await MenuModel.find({ _id: { $in: ids } })
      .lean()
      .exec();
    // map & preserve order of ids
    const map = new Map(docs.map((d: any) => [String(d._id), d]));
    return ids.map((id) => map.get(id)).filter(Boolean);
  },

  searchByName: async (searchTerm: string) => {
    await connectDb();
    return await MenuModel.find({
      name: { $regex: searchTerm, $options: 'i' },
    }).lean();
  },
};
