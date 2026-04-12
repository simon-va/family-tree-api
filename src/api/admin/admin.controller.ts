import type { ApiRequest, ApiResponse } from '../../utils/api.types.js';
import { AdminHandler } from './admin.handler.js';
import type { AdminDataDto, AdminDataQuery, AdminUserKeyCreationInput, AdminUserKeyCreationQuery } from './admin.types.js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export class AdminController {
  static async getData(
    ctx: ApiRequest<undefined, AdminDataQuery>,
  ): Promise<ApiResponse<AdminDataDto>> {
    const { password, ...flags } = ctx.query ?? {};

    if (!password || password !== ADMIN_PASSWORD) return { status: 401, body: { message: 'Invalid password' } };

    const data = await AdminHandler.getData(flags);
    return { status: 200, body: data };
  }

  static async deleteData(
    ctx: ApiRequest<undefined, AdminDataQuery>,
  ): Promise<ApiResponse<void>> {
    const { password, ...flags } = ctx.query ?? {};

    if (!password || password !== ADMIN_PASSWORD) return { status: 401, body: { message: 'Invalid password' } };

    await AdminHandler.deleteData(flags);
    return { status: 204 };
  }

  static async setUserKeyCreation(
    ctx: ApiRequest<AdminUserKeyCreationInput, AdminUserKeyCreationQuery>,
  ): Promise<ApiResponse<void>> {
    const password = ctx.query?.password;
    const enabled = ctx.body?.enabled;

    if (!password || password !== ADMIN_PASSWORD) return { status: 401, body: { message: 'Invalid password' } };
    if (enabled === undefined) return { status: 400, body: { message: 'enabled is required in request body' } };

    await AdminHandler.setUserKeyCreation(enabled);
    return { status: 204 };
  }
}
