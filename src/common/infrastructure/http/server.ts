import { env } from '../env';

import api from './api';

const port = env.PORT;

api.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
