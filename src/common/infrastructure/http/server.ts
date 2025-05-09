import { env } from '../env';
import { dataSource } from '../typeorm';

import api from './api';

const port = env.PORT;

dataSource
    .initialize()
    .then(() => {
        api.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log('API docs available at GET /docs');
        });
    })
    .catch(error => {
        console.error('Error during Data Source initialization:', error);
    });
