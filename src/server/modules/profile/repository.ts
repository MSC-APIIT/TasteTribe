import { connectDb } from '@/server/lib/db';
import mongoose, { Schema } from 'mongoose';

const ProfileSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bio: { type: String },
    profileImage: { type: String },
  },
  { timestamps: true }
);

const ProfileModel =
  mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);

export const ProfileRepository = {
  create: async (data: {
    userId: string;
    bio?: string;
    profileImage?: string;
  }) => {
    await connectDb();
    const existing = await ProfileModel.findById(data.userId);
    if (existing) return existing;

    const profile = await ProfileModel.create({
      _id: data.userId,
      bio: data.bio,
      profileImage: data.profileImage,
    });
    console.log(`Profile created for userId: ${data.userId}`);
    return profile;
  },

  updateByUserId: async (
    userId: string,
    updates: Partial<{ name: string; bio: string; profileImage: string }>
  ) => {
    await connectDb();
    return ProfileModel.findByIdAndUpdate(userId, updates, { new: true });
  },

  findByUserId: async (userId: string) => {
    await connectDb();
    return ProfileModel.findById(userId);
  },
};
