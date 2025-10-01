import { connectDb } from '@/server/lib/db';
import mongoose, { Schema } from 'mongoose';

const StallSchema = new Schema(
  {
    profileId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true }, // foreign key
    stallName: String,
    stallDescription: String,
    stallImage: {
      type: [String], // Accepts an array of strings
      default: [],
    },
  },
  { timestamps: true }
);

const StallModel =
  mongoose.models.Stall || mongoose.model('Stall', StallSchema);

export const StallRepository = {
  create: async (data: {
    profileId: string;
    stallName?: string;
    stallDescription?: string;
    stallImage?: string[];
  }) => {
    await connectDb();
    return StallModel.create(data);
  },

  updateByStallId: async (
    stallId: string,
    updates: Partial<{
      stallName: string;
      stallDescription: string;
      stallImage: string[];
    }>
  ) => {
    await connectDb();
    return StallModel.findByIdAndUpdate(stallId, updates, { new: true });
  },

  findByStallId: async (stallId: string) => {
    await connectDb();
    return StallModel.findById(stallId);
  },

  findAllByProfileId: async (profileId: string) => {
    await connectDb();
    return StallModel.find({ profileId });
  },

  deleteByStallId: async (stallId: string) => {
    await connectDb();
    return StallModel.findByIdAndDelete(stallId);
  },

  getStallByIdForProfile: async (profileId: string, stallId: string) => {
    await connectDb();
    return StallModel.findOne({ _id: stallId, profileId });
  },

  findByIds: async (ids: string[]) => {
    await connectDb();
    if (!ids?.length) return [];
    const docs = await StallModel.find({ _id: { $in: ids } })
      .lean()
      .exec();
    const map = new Map(docs.map((d: any) => [String(d._id), d]));
    return ids.map((id) => map.get(id)).filter(Boolean);
  },

  searchByName: async (searchTerm: string) => {
    await connectDb();
    return await StallModel.find({
      stallName: { $regex: searchTerm, $options: 'i' },
    }).lean();
  },
};
