import { MenuRatingRepository } from './repository';

export const MenuRatingService = {
  rateMenu: async (menuId: string, userId: string, rating: number) => {
    return MenuRatingRepository.addOrUpdate(menuId, userId, rating);
  },

  getMenuRating: async (menuId: string, userId?: string) => {
    const [stats] = await MenuRatingRepository.getStatsForMenu(menuId);
    const userRating = userId
      ? await MenuRatingRepository.getUserRating(menuId, userId)
      : null;

    return {
      averageRating: stats?.averageRating || 0,
      ratingCount: stats?.ratingCount || 0,
      userRating: userRating?.rating || null,
    };
  },
};
