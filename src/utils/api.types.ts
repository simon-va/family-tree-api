type HttpStatus = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 422 | 500;
type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface ApiResponse<T = any> {
  status: HttpStatus;
  body?: T | { message?: string };
}

export type ApiRequest<T = undefined, Q = undefined, P = undefined> = {
  method: HttpMethod;
  body?: T;
  query?: Q;
  params?: P;
};
