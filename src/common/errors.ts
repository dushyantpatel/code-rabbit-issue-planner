/**
 * Custom error class for HTTP errors
 */
class HTTPError extends Error {
    public statusCode: number;
    public errorMessage: string;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.errorMessage = message;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HTTPError);
        }
    }
}

/**
 * Centralized function to throw HTTP errors
 * @param statusCode the HTTP status code
 * @param message the error message
 * @throws HTTPError
 */
function throwHttpError(statusCode: number, message: string): never {
    throw new HTTPError(statusCode, message);
}

export { HTTPError, throwHttpError };
