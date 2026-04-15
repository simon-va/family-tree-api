import type { ApiRequest, ApiResponse } from '../../utils/api.types.js';
import { ApiError, getApiErrorResponse } from '../../utils/apiError.js';
import { UserKeyRepository } from '../../resources/user-keys/userKey.repository.js';
import { ResidencesHandler } from './residences.handler.js';
import type { CreateResidenceInput, ResidenceDto, UpdateResidenceInput } from './residences.types.js';

export class ResidencesController {
  static async getResidences(): Promise<ApiResponse<ResidenceDto[]>> {
    const userKeyId = await chayns.person.current.getId();

    if (!await UserKeyRepository.validate(userKeyId)) {
      return { status: 401, body: { message: 'Not registered' } };
    }

    try {
      const residences = await ResidencesHandler.getResidencesByUserKey(userKeyId);
      return { status: 200, body: residences };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }

  static async addResidence(
    ctx: ApiRequest<CreateResidenceInput>,
  ): Promise<ApiResponse<ResidenceDto>> {
    const userKeyId = await chayns.person.current.getId();
    const body = ctx.body;

    if (!await UserKeyRepository.validate(userKeyId)) {
      return { status: 401, body: { message: 'Not registered' } };
    }

    if (!body) {
      return { status: 400, body: { message: 'No data in body provided' } };
    }

    try {
      const result = await ResidencesHandler.createResidence(userKeyId, body);
      return { status: 201, body: result };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }
      throw error;
    }
  }

  static async updateResidence(
    ctx: ApiRequest<UpdateResidenceInput, undefined, { id: string }>,
  ): Promise<ApiResponse<ResidenceDto>> {
    const id = ctx.params?.id;
    const userKeyId = await chayns.person.current.getId();
    const body = ctx.body;

    if (!id) {
      return { status: 400, body: { message: 'No id in params provided' } };
    }

    if (!await UserKeyRepository.validate(userKeyId)) {
      return { status: 401, body: { message: 'Not registered' } };
    }

    if (!body) {
      return { status: 400, body: { message: 'No data in body provided' } };
    }

    try {
      const result = await ResidencesHandler.updateResidence(id, userKeyId, body);
      return { status: 200, body: result };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }
      throw error;
    }
  }

  static async deleteResidence(
    ctx: ApiRequest<undefined, undefined, { id: string }>,
  ): Promise<ApiResponse<void>> {
    const id = ctx.params?.id;
    const userKeyId = await chayns.person.current.getId();

    if (!id) {
      return { status: 400, body: { message: 'No id in params provided' } };
    }

    if (!await UserKeyRepository.validate(userKeyId)) {
      return { status: 401, body: { message: 'Not registered' } };
    }

    try {
      await ResidencesHandler.deleteResidence(id, userKeyId);
      return { status: 204 };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }
      throw error;
    }
  }
}
