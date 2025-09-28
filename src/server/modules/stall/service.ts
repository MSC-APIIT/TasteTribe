import { StallRepository } from '../stall/repository';
import { StallDto } from './type';

export const StallService = {
  createStall: async (
    profileId: string,
    data: Partial<{ stallName: string; stallDescription: string; stallImage: string[] }>
  ): Promise<StallDto> => {
    return StallRepository.create({ profileId, ...data });
  },

  updateStall: async (
    profileId: string,
    stallId: string,
    updates: Partial<{ stallName: string; stallDescription: string; stallImage: string[] }>
  ): Promise<StallDto | null> => {
    const stall = await StallRepository.findByStallId(stallId);
    if (!stall || stall.profileId.toString() !== profileId) return null;

    return StallRepository.updateByStallId(stallId, updates);
  },

  deleteStall: async (
    profileId: string,
    stallId: string
  ): Promise<boolean> => {
    const stall = await StallRepository.findByStallId(stallId);
    if (!stall || stall.profileId.toString() !== profileId) return false;

    await StallRepository.deleteByStallId(stallId);
    return true;
  },

  getStallsByProfile: async (profileId: string): Promise<StallDto[]> => {
    return StallRepository.findAllByProfileId(profileId);
  },

  findStallById: async(stallId: string, profileId: string) : Promise<StallDto[]> => {
    return StallRepository.getStallByIdForProfile(stallId, profileId);
  }
};
