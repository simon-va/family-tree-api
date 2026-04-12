import type { ApiResponse } from './api.types.js';

export class ApiError extends Error {
  constructor(public status: ApiResponse['status'], message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getApiErrorResponse(error: ApiError): ApiResponse {
  return { status: error.status, body: { message: error.message } };
}
