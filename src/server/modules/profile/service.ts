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

    return ProfileRepository.create({ userId, bio, profileImage });
  },

  updateProfile: async (
    userId: string,
    updates: Partial<{ bio: string; profileImage: string }>
  ): Promise<ProfileDto | null> => {
    return ProfileRepository.updateByUserId(userId, updates);
  },

  updateUserName: async (userId: string, name: string): Promise<void> => {
    const user = await findUserById(userId);
    if (!user) throw new Error('User not found');
    await updateUserNameById(userId, name);
  },

  getProfile: async (userId: string): Promise<{
    profile: Awaited<ReturnType<typeof ProfileRepository.findByUserId>>;
    name: string;
  } | null> => {
    const [user, profile] = await Promise.all([
      findUserById(userId),
      ProfileRepository.findByUserId(userId),
    ]);

    if (!user || !profile) return null;

    return {
      profile,
      name: user.name || 'Unknown User',
    };
  },
};
