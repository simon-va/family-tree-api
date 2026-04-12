import type { UserKeyResource } from '../../resources/user-keys/userKey.model.js';
import type { ApiResponse } from '../../utils/api.types.js';
import { ApiError, getApiErrorResponse } from '../../utils/apiError.js';
import { AuthHandler } from './auth.handler.js';

export class AuthController {
  static async generateUserKey(): Promise<ApiResponse<UserKeyResource>> {
    try {
      const result = await AuthHandler.generateUserKey();
      return { status: 201, body: result };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }
}
