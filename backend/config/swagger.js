import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wedding Site API',
      version: '1.0.0',
      description: 'API documentation for the Wedding Interactive Website',
      contact: {
        name: 'Wedding Site Team',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API Base URL',
      },
    ],
    components: {
      securitySchemes: {
        AdminAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Admin secret key for protected routes',
        },
      },
      schemas: {
        GuestbookEntry: {
          type: 'object',
          required: ['message'],
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier',
            },
            name: {
              type: 'string',
              description: 'Guest name (optional, defaults to Anonymous)',
              maxLength: 100,
            },
            message: {
              type: 'string',
              description: 'Guest message',
              minLength: 1,
              maxLength: 500,
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Entry creation timestamp',
            },
          },
        },
        Photo: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier',
            },
            filename: {
              type: 'string',
              description: 'Generated filename',
            },
            filepath: {
              type: 'string',
              description: 'File path on server',
            },
            mimetype: {
              type: 'string',
              description: 'MIME type of the file',
            },
            uploadedBy: {
              type: 'string',
              description: 'Uploader name (defaults to Anonymous Guest)',
            },
            approved: {
              type: 'boolean',
              description: 'Whether the media is approved for public display',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Upload timestamp',
            },
          },
        },
        VisitorLog: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier',
            },
            ip_address: {
              type: 'string',
              description: 'Visitor IP address',
            },
            latitude: {
              type: 'number',
              description: 'Geographic latitude',
            },
            longitude: {
              type: 'number',
              description: 'Geographic longitude',
            },
            city: {
              type: 'string',
              description: 'City name',
            },
            country: {
              type: 'string',
              description: 'Country name',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Visit timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './controllers/*.js'], // Paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export default specs;
