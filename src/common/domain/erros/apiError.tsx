export class ApiError extends Error {
    public readonly statusCode: number;

    constructor(message = 'Something went wrong.', statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}
