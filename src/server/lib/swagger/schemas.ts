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
    required: ['id', 'profileId', 'stallName', 'stallDescription'],
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
  ProfileDto: {
    type: 'object',
    properties: {
      userId: { type: 'string' },
      bio: { type: 'string' },
      profileImage: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['userId'],
    example: {
      userId: '64a1b2c3d4e5f6789a012345',
      bio: 'Food enthusiast and stall owner',
      profileImage: '/profile/user123.jpg',
      createdAt: '2024-01-15T10:30:00.000Z',
      updatedAt: '2024-01-15T10:30:00.000Z',
    },
  },

  ProfileWithNameDto: {
    type: 'object',
    properties: {
      profile: { $ref: '#/components/schemas/ProfileDto' },
      name: { type: 'string' },
    },
    required: ['profile', 'name'],
    example: {
      profile: {
        userId: '64a1b2c3d4e5f6789a012345',
        bio: 'Food enthusiast and stall owner',
        profileImage: '/profile/user123.jpg',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z',
      },
      name: 'John Doe',
    },
  },

  ProfileCreateRequest: {
    type: 'object',
    properties: {
      bio: { type: 'string' },
      profileImage: { type: 'string' },
    },
    example: {
      bio: 'Food enthusiast and stall owner',
      profileImage: '/profile/user123.jpg',
    },
  },

  ProfileUpdateRequest: {
    type: 'object',
    properties: {
      bio: { type: 'string' },
      profileImage: { type: 'string' },
    },
    example: {
      bio: 'Updated bio - Passionate food lover',
      profileImage: '/profile/user123-new.jpg',
    },
  },

  UpdateNameRequest: {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
    required: ['name'],
    example: {
      name: 'Jane Doe',
    },
  },

  //Menu
  MenuItemDto: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      stallId: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' },
      images: {
        type: 'array',
        items: { type: 'string' },
      },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'stallId', 'name', 'price'],
    example: {
      id: '64d2d6115e6f61465c94a7f5',
      stallId: '64a1b2c3d4e5f6789a012345',
      name: 'Kottu Roti',
      description: 'Spicy chicken kottu with vegetables',
      price: 450.0,
      images: ['/menu/kottu.jpg'],
      createdAt: '2024-01-15T10:30:00.000Z',
      updatedAt: '2024-01-15T10:30:00.000Z',
    },
  },

  MenuCreateRequest: {
    type: 'object',
    properties: {
      stallId: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' },
      images: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['stallId', 'name', 'price'],
    example: {
      stallId: '64a1b2c3d4e5f6789a012345',
      name: 'Kottu Roti',
      description: 'Spicy chicken kottu with vegetables',
      price: 450.0,
      images: ['/menu/kottu.jpg'],
    },
  },

  MenuUpdateRequest: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' },
      images: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    example: {
      name: 'Kottu Roti Special',
      description: 'Extra spicy chicken kottu with cheese',
      price: 500.0,
      images: ['/menu/kottu-special.jpg'],
    },
  },

  PopularMenuDto: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      images: {
        type: 'array',
        items: { type: 'string' },
      },
      description: { type: 'string' },
      price: { type: 'string' },
      averageRating: { type: 'number' },
      ratingCount: { type: 'number' },
      stallName: { type: 'string' },
      stallOverallRating: { type: 'number' },
      comments: {
        type: 'array',
        items: { type: 'object' },
      },
    },
    example: {
      id: '64d2d6115e6f61465c94a7f5',
      name: 'Kottu Roti',
      images: ['/menu/kottu.jpg'],
      description: 'Spicy chicken kottu with vegetables',
      price: 'LKR 450.00',
      averageRating: 4.5,
      ratingCount: 25,
      stallName: 'Ceylon Kottu House',
      stallOverallRating: 4.3,
      comments: [],
    },
  },

  //Menu Ratings
  MenuRatingDto: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      menuId: { type: 'string' },
      userId: { type: 'string' },
      rating: { type: 'number', minimum: 1, maximum: 5 },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'menuId', 'userId', 'rating'],
    example: {
      id: '64d2d6115e6f61465c94a7f5',
      menuId: '64a1b2c3d4e5f6789a012345',
      userId: '64b3c4d5e6f7a8901234567b',
      rating: 5,
      createdAt: '2024-01-15T10:30:00.000Z',
      updatedAt: '2024-01-15T10:30:00.000Z',
    },
  },

  MenuRatingRequest: {
    type: 'object',
    properties: {
      menuId: { type: 'string' },
      rating: { type: 'number', minimum: 1, maximum: 5 },
    },
    required: ['menuId', 'rating'],
    example: {
      menuId: '64a1b2c3d4e5f6789a012345',
      rating: 5,
    },
  },

  MenuRatingStatsDto: {
    type: 'object',
    properties: {
      averageRating: { type: 'number' },
      ratingCount: { type: 'number' },
      userRating: { type: 'number', nullable: true },
    },
    example: {
      averageRating: 4.5,
      ratingCount: 25,
      userRating: 5,
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
