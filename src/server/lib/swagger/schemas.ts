// Centralized schemas - define once, use everywhere
//User
export const schemas = {
  UserDto: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      email: { type: 'string', format: 'email' },
      name: { type: 'string' },
    },
    required: ['id', 'email'],
    example: {
      id: '64a1b2c3d4e5f6789a012345',
      email: 'john.doe@example.com',
      name: 'John Doe',
    },
  },

  RegisterRequest: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      name: { type: 'string' },
    },
    required: ['email', 'password'],
    example: {
      email: 'john.doe@example.com',
      password: 'securePassword123',
      name: 'John Doe',
    },
  },

  LoginRequest: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    },
    required: ['email', 'password'],
    example: {
      email: 'john.doe@example.com',
      password: 'securePassword123',
    },
  },

  AuthResponse: {
    type: 'object',
    properties: {
      user: { $ref: '#/components/schemas/UserDto' },
      accessToken: { type: 'string' },
      refreshToken: { type: 'string' },
    },
    example: {
      user: {
        id: '64a1b2c3d4e5f6789a012345',
        email: 'john.doe@example.com',
        name: 'John Doe',
      },
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  },

  RefreshTokenRequest: {
    type: 'object',
    properties: {
      refreshToken: { type: 'string' },
    },
    required: ['refreshToken'],
    example: {
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  },

  TokenResponse: {
    type: 'object',
    properties: {
      accessToken: { type: 'string' },
      refreshToken: { type: 'string' },
    },
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  },

  //Profile
  // ProfileDto: {
  //   type: 'object',
  //   properties: {
  //     id: { type: 'string' },
  //     bio: { type: 'string'},
  //     image: { type: 'string' },
  //   },
  //   required: ['id', 'bio'],
  //   example: {
  //     id: '64a1b2c3d4e5f6789a012345',
  //     bio: 'Food Lover',
  //     image: '/logo.png',
  //   },
  // },

  //stall
  StallDto: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      profileId: { type: 'string' },
      stallName: { type: 'string' },
      stallDescription: { type: 'string' },
      stallImage: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: [
      'id',
      'profileId',
      'stallName',
      'stallDescription',
    ],
    example: {
      id: '64d2d6115e6f61465c94a7f5',
      profileId: '64a1b2c3d4e5f6789a012345',
      stallName: 'Stall Name',
      stallDescription: 'Stall Description!',
      stallImage: ['/logo.png'],
    },
  },
  StallCreateRequest: {
    type: 'object',
    properties: {
      stallName: { type: 'string' },
      stallDescription: { type: 'string' },
      stallImage: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['stallName', 'stallDescription'],
    example: {
      stallName: 'Stall Name',
      stallDescription: 'Stall Description!',
      stallImage: ['/logo.png'],
    },
  },
};

// Helper functions for common response patterns
export const responses = {
  success: (schema: string, description = 'Success') => ({
    200: {
      description,
      content: {
        'application/json': {
          schema: { $ref: `#/components/schemas/${schema}` },
        },
      },
    },
  }),

  created: (schema: string, description = 'Created') => ({
    201: {
      description,
      content: {
        'application/json': {
          schema: { $ref: `#/components/schemas/${schema}` },
        },
      },
    },
  }),

  error: (status: number, message: string) => ({
    [status]: { description: message },
  }),

  common: {
    unauthorized: { 401: { description: 'Unauthorized' } },
    badRequest: { 400: { description: 'Bad request' } },
    notFound: { 404: { description: 'Not found' } },
    serverError: { 500: { description: 'Server error' } },
  },
};

export const requestBody = (schema: string) => ({
  required: true,
  content: {
    'application/json': {
      schema: { $ref: `#/components/schemas/${schema}` },
    },
  },
});
