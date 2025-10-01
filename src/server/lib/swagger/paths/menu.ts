import { responses, requestBody } from '../schemas';

export const menuPaths = {
  '/api/menu': {
    post: {
      tags: ['Menu'],
      summary: 'Create a new menu item',
      security: [{ bearerAuth: [] }],
      requestBody: requestBody('MenuCreateRequest'),
      responses: {
        ...responses.success('MenuItemDto', 'Menu item created successfully'),
        ...responses.error(400, 'Invalid menu data'),
        ...responses.error(500, 'Internal server error'),
      },
    },
  },
  '/api/menu/{menuId}': {
    get: {
      tags: ['Menu'],
      summary: 'Get menu item by ID',
      parameters: [
        {
          name: 'menuId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Menu item ID',
        },
      ],
      responses: {
        ...responses.success('MenuItemDto', 'Menu item retrieved successfully'),
        ...responses.error(404, 'Menu item not found'),
        ...responses.error(500, 'Internal server error'),
      },
    },
    patch: {
      tags: ['Menu'],
      summary: 'Update menu item',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'menuId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Menu item ID',
        },
      ],
      requestBody: requestBody('MenuUpdateRequest'),
      responses: {
        ...responses.success('MenuItemDto', 'Menu item updated successfully'),
        ...responses.error(404, 'Menu item not found'),
        ...responses.error(500, 'Internal server error'),
      },
    },
    delete: {
      tags: ['Menu'],
      summary: 'Delete menu item',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'menuId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Menu item ID',
        },
      ],
      responses: {
        ...responses.success('MenuItemDto', 'Menu item deleted successfully'),
        ...responses.error(404, 'Menu item not found'),
        ...responses.error(500, 'Internal server error'),
      },
    },
  },
  '/api/menu/stall/{stallId}': {
    get: {
      tags: ['Menu'],
      summary: 'Get all menu items for a stall',
      parameters: [
        {
          name: 'stallId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Stall ID',
        },
      ],
      responses: {
        200: {
          description: 'Menu items retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/MenuItemDto' },
              },
            },
          },
        },
        ...responses.error(500, 'Internal server error'),
      },
    },
  },
  '/api/menu/popular': {
    get: {
      tags: ['Menu'],
      summary: 'Get popular menu items',
      parameters: [
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: { type: 'integer', default: 10 },
          description: 'Number of items to return',
        },
      ],
      responses: {
        200: {
          description: 'Popular menu items retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/PopularMenuDto' },
              },
            },
          },
        },
        ...responses.error(500, 'Internal server error'),
      },
    },
  },
  '/api/menu/search': {
    get: {
      tags: ['Menu'],
      summary: 'Search menu items',
      parameters: [
        {
          name: 'query',
          in: 'query',
          required: true,
          schema: { type: 'string' },
          description: 'Search term',
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: { type: 'integer', default: 10 },
          description: 'Number of results',
        },
      ],
      responses: {
        200: {
          description: 'Search results',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/PopularMenuDto' },
              },
            },
          },
        },
        ...responses.error(500, 'Internal server error'),
      },
    },
  },
};
