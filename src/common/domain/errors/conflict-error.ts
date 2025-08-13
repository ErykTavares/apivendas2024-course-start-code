import { ApiError } from './apiError';

export class ConflictError extends ApiError {
    constructor(message: string) {
        super(message, 409);
        this.name = 'ConflictError';
    }
}
