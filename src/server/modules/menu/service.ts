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
};
