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

function throwHttpError(statusCode: number, message: string): never {
    throw new HTTPError(statusCode, message);
}

export { HTTPError, throwHttpError };
