import { schemas } from './schemas';
import { authPaths } from './paths/auth';
import { stallPaths } from './paths/stall';

export const getSwaggerSpec = (baseUrl?: string) => {
  const getApiUrl = () => {
    if (baseUrl) return `${baseUrl}`;
    if (process.env.NEXT_PUBLIC_API_URL)
      return `${process.env.NEXT_PUBLIC_API_URL}`;
    return 'http://localhost:3000';
  };

  return {
    openapi: '3.0.0',
    info: {
      title: 'Next.js API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Next.js application',
    },
    servers: [
      {
        url: getApiUrl(),
        description: 'API Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas,
    },
    paths: {
      ...authPaths,
      ...stallPaths,
      // Future modules just import and spread here:
      // ...userPaths,
      // ...productPaths,
    },
  };
};
