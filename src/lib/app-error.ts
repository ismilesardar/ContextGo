export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // This helps distinguish between known app errors and unexpected crashes
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
