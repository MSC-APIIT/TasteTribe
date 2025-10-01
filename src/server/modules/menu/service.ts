import { MenuCommentRepository } from '../menuComments/repository';
import { MenuRatingRepository } from '../menuRatings/repository';
import { StallRepository } from '../stall/repository';
import { MenuRepository } from './repository';
import { MenuItemDto } from './type';

export const MenuService = {
  createMenu: async (stallId: string, data: Partial<MenuItemDto>) => {
    const menuData: MenuItemDto = {
      stallId,
      name: data.name || '',
      description: data.description || '',
      price: data.price || 0,
      images: data.images || [],
    };
    return MenuRepository.create(menuData);
  },

  updateMenu: async (menuId: string, updates: Partial<MenuItemDto>) => {
    // only update provided fields
    return MenuRepository.updateById(menuId, updates);
  },

  deleteMenu: async (menuId: string) => {
    return MenuRepository.deleteById(menuId);
  },

  getMenuById: async (menuId: string) => {
    return MenuRepository.findById(menuId);
  },

  getMenusByStall: async (stallId: string) => {
    return MenuRepository.findAllByStallId(stallId);
  },

  getPopularMenus: async (limit?: number) => {
    const stats = await MenuRatingRepository.getPopularMenus();

    let menus;
    let slicedStats;

    if (!stats?.length) {
      // No ratings exist - return empty for now or handle differently
      return [];
    }

    slicedStats = limit ? stats.slice(0, limit) : stats;
    const ids = slicedStats.map((s) => String(s._id));

    // 1) Fetch all menus
    menus = await MenuRepository.findByIds(ids);

    if (!menus?.length) return [];

    // 2) Fetch stalls (map by id for quick lookup)
    const stallIds = Array.from(
      new Set(menus.map((m: { stallId: any }) => String(m.stallId)))
    );
    const stalls = await StallRepository.findByIds(stallIds);

    // Create stall map with proper typing
    const stallMap = new Map(stalls.map((s: any) => [String(s._id), s]));

    // 3) Calculate overall rating for each stall (aggregate from all menus in that stall)
    const stallRatings = new Map<string, { total: number; count: number }>();

    // Get all menu ratings for these stalls
    for (const menu of menus) {
      const stallId = String(menu.stallId);
      const stat = slicedStats.find((s) => String(s._id) === String(menu._id));

      if (stat && stat.averageRating > 0) {
        if (!stallRatings.has(stallId)) {
          stallRatings.set(stallId, { total: 0, count: 0 });
        }
        const current = stallRatings.get(stallId)!;
        current.total += stat.averageRating;
        current.count += 1;
      }
    }

    // 4) Fetch comments for all menus
    const commentsByMenu = await MenuCommentRepository.findByMenuIds(ids);

    // 5) Merge all into frontend shape
    const result = menus.map(
      (menu: {
        _id: any;
        stallId: any;
        name: any;
        images: any;
        description: any;
        price: number;
      }) => {
        const stat = slicedStats.find(
          (s) => String(s._id) === String(menu._id)
        );
        const stall = stallMap.get(String(menu.stallId));
        const stallId = String(menu.stallId);

        // Calculate stall overall rating
        const stallRatingData = stallRatings.get(stallId);
        const stallOverallRating = stallRatingData
          ? stallRatingData.total / stallRatingData.count
          : 0;

        return {
          id: String(menu._id),
          name: menu.name,
          images: menu.images || [],
          description: menu.description || '',
          price: `LKR ${menu.price.toFixed(2)}`,
          averageRating: stat?.averageRating || 0,
          ratingCount: stat?.ratingCount || 0,
          stallName: stall?.stallName || 'Unknown Stall',
          stallOverallRating: Number(stallOverallRating.toFixed(1)),
          comments: commentsByMenu[String(menu._id)] || [],
        };
      }
    );

    return result;
  },

  searchMenus: async (query: string, limit: number = 10) => {
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
      return [];
    }

    // 1) Search menus by name
    const matchingMenus = await MenuRepository.searchByName(searchTerm);

    // 2) Search stalls by name and get their menus
    const matchingStalls = await StallRepository.searchByName(searchTerm);
    const matchingStallIds = matchingStalls.map((s: any) => String(s._id));
    const menusFromStalls =
      matchingStallIds.length > 0
        ? await MenuRepository.findByStallIds(matchingStallIds)
        : [];

    // 3) Combine and deduplicate menus
    const allMatchingMenus = [...matchingMenus, ...menusFromStalls];
    const uniqueMenus = Array.from(
      new Map(allMatchingMenus.map((m: any) => [String(m._id), m])).values()
    );

    if (!uniqueMenus?.length) {
      return [];
    }

    // 4) Get all stalls
    const stallIds = Array.from(
      new Set(uniqueMenus.map((m: any) => String(m.stallId)))
    );
    const stalls = await StallRepository.findByIds(stallIds);

    // 5) Limit results
    const limitedMenus = uniqueMenus.slice(0, limit);

    if (!limitedMenus.length) {
      return [];
    }

    const menuIds = limitedMenus.map((m: any) => String(m._id));

    // 6) Get rating stats for these menus
    const stats = await MenuRatingRepository.getMenuStats(menuIds);

    // Create stall map
    const stallMap = new Map(stalls.map((s: any) => [String(s._id), s]));

    // 7) Calculate overall rating for each stall
    const stallRatings = new Map<string, { total: number; count: number }>();

    for (const menu of limitedMenus) {
      const stallId = String((menu as any).stallId);
      const stat = stats.find(
        (s: any) => String(s._id) === String((menu as any)._id)
      );

      if (stat && stat.averageRating > 0) {
        if (!stallRatings.has(stallId)) {
          stallRatings.set(stallId, { total: 0, count: 0 });
        }
        const current = stallRatings.get(stallId)!;
        current.total += stat.averageRating;
        current.count += 1;
      }
    }

    // 8) Fetch comments
    const commentsByMenu = await MenuCommentRepository.findByMenuIds(menuIds);

    // 9) Format results (same structure as getPopularMenus)
    const result = limitedMenus.map((menu: any) => {
      const stat = stats.find((s: any) => String(s._id) === String(menu._id));
      const stall = stallMap.get(String(menu.stallId));
      const stallId = String(menu.stallId);

      const stallRatingData = stallRatings.get(stallId);
      const stallOverallRating = stallRatingData
        ? stallRatingData.total / stallRatingData.count
        : 0;

      return {
        id: String(menu._id),
        name: menu.name,
        images: menu.images || [],
        description: menu.description || '',
        price: `LKR ${menu.price.toFixed(2)}`,
        averageRating: stat?.averageRating || 0,
        ratingCount: stat?.ratingCount || 0,
        stallName: stall?.stallName || 'Unknown Stall',
        stallOverallRating: Number(stallOverallRating.toFixed(1)),
        comments: commentsByMenu[String(menu._id)] || [],
      };
    });

    return result;
  },
};
