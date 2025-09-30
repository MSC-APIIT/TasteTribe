import { responses, requestBody } from '../schemas';

export const authPaths = {
  '/auth/register': {
    post: {
      tags: ['Authentication'],
      summary: 'Register a new user',
      requestBody: requestBody('RegisterRequest'),
      responses: {
        ...responses.created('UserDto', 'User registered successfully'),
        ...responses.error(400, 'Email already registered'),
      },
    },
  },

  '/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'User login',
      requestBody: requestBody('LoginRequest'),
      responses: {
        ...responses.success('AuthResponse', 'Login successful'),
        ...responses.common.unauthorized,
      },
    },
  },

  '/auth/refresh': {
    post: {
      tags: ['Authentication'],
      summary: 'Refresh access token',
      security: [{ bearerAuth: [] }],
      requestBody: requestBody('RefreshTokenRequest'),
      responses: {
        ...responses.success('TokenResponse', 'Tokens refreshed'),
        ...responses.common.unauthorized,
      },
    },
  },

  '/auth/me': {
    get: {
      tags: ['Authentication'],
      summary: 'Get current user profile',
      security: [{ bearerAuth: [] }],
      responses: {
        ...responses.success('UserDto', 'User profile retrieved'),
        ...responses.common.unauthorized,
        ...responses.common.notFound,
      },
    },
  },
};
