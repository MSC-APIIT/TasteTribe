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
};
