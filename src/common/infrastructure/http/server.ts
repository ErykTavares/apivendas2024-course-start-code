import api from './api';

const port = process.env.PORT || 3333;

api.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
