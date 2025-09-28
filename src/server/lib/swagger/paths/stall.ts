import { responses, requestBody } from '../schemas';

export const stallPaths = {
  '/api/stall': {
    post: {
      tags: ['Stalls'],
      summary: 'Create a new stall',
      security: [{ bearerAuth: [] }],
      requestBody: requestBody('StallCreateRequest'),
      responses: {
        ...responses.success('StallDto', 'Stall created successfully'),
        ...responses.error(400, 'Stall with the same name already exists'),
        ...responses.error(500, 'Internal server error'),
      },
    },
  },
};
