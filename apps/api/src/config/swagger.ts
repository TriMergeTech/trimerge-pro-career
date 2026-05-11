import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TriMergePro Job Portal API',
      version: '1.0.0',
      description: 'Backend API documentation for the TriMergePro Job Portal.',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Local development server',
      },
      {
        url: 'https://trimerge-pro-career-uaun.onrender.com',
        description: 'Production server (Render)',
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
    },
  },
  apis: ['./src/modules/**/*.ts'],
});