import type { ApiRequest, ApiResponse } from '../../utils/api.types.js';
import { ApiError, getApiErrorResponse } from '../../utils/apiError.js';
import { UserKeyRepository } from '../../resources/user-keys/userKey.repository.js';
import { ResidencesHandler } from './residences.handler.js';
import type { CreateResidenceInput, ResidenceDto, UpdateResidenceInput } from './residences.types.js';

export class ResidencesController {
  static async getResidences(
    ctx: ApiRequest<undefined, { userKey: string }>,
  ): Promise<ApiResponse<ResidenceDto[]>> {
    const userKey = ctx.query?.userKey;

    if (!userKey) {
      return { status: 400, body: { message: 'No userKey in query parameters provided' } };
    }

    if (!await UserKeyRepository.validate(userKey)) {
      return { status: 401, body: { message: 'Invalid userKey' } };
    }

    try {
      const residences = await ResidencesHandler.getResidencesByUserKey(userKey);
      return { status: 200, body: residences };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }

  static async addResidence(
    ctx: ApiRequest<CreateResidenceInput, { userKey: string }>,
  ): Promise<ApiResponse<ResidenceDto>> {
    const userKey = ctx.query?.userKey;
    const body = ctx.body;

    if (!userKey) {
      return { status: 400, body: { message: 'No userKey in query parameters provided' } };
    }

    if (!await UserKeyRepository.validate(userKey)) {
      return { status: 401, body: { message: 'Invalid userKey' } };
    }

    if (!body) {
      return { status: 400, body: { message: 'No data in body provided' } };
    }

    try {
      const result = await ResidencesHandler.createResidence(userKey, body);
      return { status: 201, body: result };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }
      throw error;
    }
  }

  static async updateResidence(
    ctx: ApiRequest<UpdateResidenceInput, { userKey: string }, { id: string }>,
  ): Promise<ApiResponse<ResidenceDto>> {
    const id = ctx.params?.id;
    const userKey = ctx.query?.userKey;
    const body = ctx.body;

    if (!id) {
      return { status: 400, body: { message: 'No id in params provided' } };
    }

    if (!userKey) {
      return { status: 400, body: { message: 'No userKey in query parameters provided' } };
    }

    if (!await UserKeyRepository.validate(userKey)) {
      return { status: 401, body: { message: 'Invalid userKey' } };
    }

    if (!body) {
      return { status: 400, body: { message: 'No data in body provided' } };
    }

    try {
      const result = await ResidencesHandler.updateResidence(id, userKey, body);
      return { status: 200, body: result };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }
      throw error;
    }
  }

  static async deleteResidence(
    ctx: ApiRequest<undefined, { userKey: string }, { id: string }>,
  ): Promise<ApiResponse<void>> {
    const id = ctx.params?.id;
    const userKey = ctx.query?.userKey;

    if (!id) {
      return { status: 400, body: { message: 'No id in params provided' } };
    }

    if (!userKey) {
      return { status: 400, body: { message: 'No userKey in query parameters provided' } };
    }

    if (!await UserKeyRepository.validate(userKey)) {
      return { status: 401, body: { message: 'Invalid userKey' } };
    }

    try {
      await ResidencesHandler.deleteResidence(id, userKey);
      return { status: 204 };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }
      throw error;
    }
  }
}
