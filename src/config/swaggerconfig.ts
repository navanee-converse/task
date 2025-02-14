import swaggerAutogen from 'swagger-autogen';

const outfile = '../../swagger-out.json';
const endpointfile = ['./app.ts'];

const option = {
  info: {
    title: 'Task',
    version: '1.0.0',
    description: 'Documentation for APIs',
  },
  host: 'localhost:8000',
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    },
  },
  security: [{ BearerAuth: [] }],
};

swaggerAutogen(outfile, endpointfile, option);
