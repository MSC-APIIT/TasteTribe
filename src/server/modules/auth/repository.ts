import { connectDb } from '@/server/lib/db';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ProfileRepository } from '../profile/repository';

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    name: String,
    refreshTokenHash: String,
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export const createUser = async (
  email: string,
  password: string,
  name?: string
) => {
  await connectDb();
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ email, passwordHash, name });

  // Automatically create profile after user is created
  await ProfileRepository.create({
    userId: user._id,
    bio: '',
    profileImage: '',
  });

  return user;
};

export const findUserByEmail = async (email: string) => {
  await connectDb();
  return UserModel.findOne({ email });
};

export const findUserById = async (id: string) => {
  await connectDb();
  return UserModel.findById(id);
};

export const setRefreshToken = async (userId: string, token: string) => {
  const hash = await bcrypt.hash(token, 10);
  await UserModel.findByIdAndUpdate(userId, { refreshTokenHash: hash });
};

export const verifyRefreshTokenHash = async (user: any, token: string) => {
  return bcrypt.compare(token, user.refreshTokenHash || '');
};

export const validatePassword = async (user: any, password: string) => {
  return bcrypt.compare(password, user.passwordHash);
};

export const updateUserNameById = async (id: string, name: string) => {
  await connectDb();
  return UserModel.findByIdAndUpdate(id, { name });
};
