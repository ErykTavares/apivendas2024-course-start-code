import express from 'express';
import cors from 'cors';

import errorHandler from './middlewares/errorHandler';

import routes from './routes';

const api = express();

api.use(cors());
api.use(express.json());
api.use(routes);
api.use(errorHandler);

export default api;
