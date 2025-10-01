import { responses, requestBody } from '../schemas';

export const menuRatingPaths = {
  '/api/menu/rating': {
    post: {
      tags: ['Menu Ratings'],
      summary: 'Rate a menu item',
      security: [{ bearerAuth: [] }],
      requestBody: requestBody('MenuRatingRequest'),
      responses: {
        ...responses.success(
          'MenuRatingDto',
          'Rating added/updated successfully'
        ),
        ...responses.error(400, 'Invalid rating data'),
        ...responses.error(500, 'Internal server error'),
      },
    },
  },
  '/api/menu/rating/{menuId}': {
    get: {
      tags: ['Menu Ratings'],
      summary: 'Get menu rating statistics',
      parameters: [
        {
          name: 'menuId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Menu item ID',
        },
        {
          name: 'userId',
          in: 'query',
          required: false,
          schema: { type: 'string' },
          description: 'User ID to get user-specific rating',
        },
      ],
      responses: {
        ...responses.success(
          'MenuRatingStatsDto',
          'Rating statistics retrieved successfully'
        ),
        ...responses.error(404, 'Menu not found'),
        ...responses.error(500, 'Internal server error'),
      },
    },
  },
};
