import { ProfileRepository } from './repository';
import { findUserById, updateUserNameById } from '../auth/repository';
import { ProfileDto } from './type';

export const ProfileService = {
  createProfile: async (
    userId: string,
    bio?: string,
    profileImage?: string
  ): Promise<ProfileDto> => {
    const user = await findUserById(userId);
    if (!user) throw new Error('User not found');

    return await ProfileRepository.create({
      userId,
      bio,
      profileImage,
    });
  },

  updateProfile: async (
    userId: string,
    updates: Partial<{ name?: string; bio: string; profileImage: string }>
  ): Promise<ProfileDto | null> => {
    if (updates.name) {
      await updateUserNameById(userId, updates.name);
    }
    return await ProfileRepository.updateByUserId(userId, updates);
  },
};