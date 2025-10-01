import { responses, requestBody } from '../schemas';

export const profilePaths = {
  '/api/profile': {
    get: {
      tags: ['Profile'],
      summary: 'Get user profile',
      security: [{ bearerAuth: [] }],
      responses: {
        ...responses.success(
          'ProfileWithNameDto',
          'Profile retrieved successfully'
        ),
        ...responses.error(404, 'Profile not found'),
        ...responses.error(500, 'Internal server error'),
      },
    },
    post: {
      tags: ['Profile'],
      summary: 'Create a new profile',
      security: [{ bearerAuth: [] }],
      requestBody: requestBody('ProfileCreateRequest'),
      responses: {
        ...responses.success('ProfileDto', 'Profile created successfully'),
        ...responses.error(400, 'Profile already exists'),
        ...responses.error(404, 'User not found'),
        ...responses.error(500, 'Internal server error'),
      },
    },
    patch: {
      tags: ['Profile'],
      summary: 'Update user profile',
      security: [{ bearerAuth: [] }],
      requestBody: requestBody('ProfileUpdateRequest'),
      responses: {
        ...responses.success('ProfileDto', 'Profile updated successfully'),
        ...responses.error(404, 'Profile not found'),
        ...responses.error(500, 'Internal server error'),
      },
    },
  },
  '/api/profile/name': {
    patch: {
      tags: ['Profile'],
      summary: 'Update user name',
      security: [{ bearerAuth: [] }],
      requestBody: requestBody('UpdateNameRequest'),
      responses: {
        ...responses.success('UserDto', 'Name updated successfully'),
        ...responses.error(404, 'User not found'),
        ...responses.error(500, 'Internal server error'),
      },
    },
  },
};
