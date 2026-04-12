import type { UserKeyResource } from '../../resources/user-keys/userKey.model.js';
import type { ApiRequest, ApiResponse } from '../../utils/api.types.js';
import { ApiError, getApiErrorResponse } from '../../utils/apiError.js';
import { AuthHandler } from './auth.handler.js';
import type { CreateUserKeyInput } from './auth.types.js';

export class AuthController {
  static async generateUserKey(
    ctx: ApiRequest<CreateUserKeyInput>,
  ): Promise<ApiResponse<UserKeyResource>> {
    const body = ctx.body;

    if (!body?.userName) {
      return { status: 400, body: { message: 'userName is required' } };
    }

    try {
      const result = await AuthHandler.generateUserKey(body.userName);
      return { status: 201, body: result };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }
}
