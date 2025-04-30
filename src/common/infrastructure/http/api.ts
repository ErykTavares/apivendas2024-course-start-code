import express from 'express';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import errorHandler from './middlewares/errorHandler';

import routes from './routes';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API STORE DOCUMENTATION',
            version: '1.0.0',
        },
    },
    apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

const api = express();

api.use(cors());
api.use(express.json());
api.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
api.use(routes);
api.use(errorHandler);

export default api;
