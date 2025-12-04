export type ApiErrorType = 'ValidationError' | 'NotFoundError' | 'ConflictError' | 'InternalServerError' | 'UnauthorizedError';

export interface ApiErrorResponse {
  error: ApiErrorType;
  message: string;
  statusCode: number;
  timestamp: string;
  details?: unknown;
}
