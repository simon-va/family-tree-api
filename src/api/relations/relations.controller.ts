import type { ApiRequest, ApiResponse } from '../../utils/api.types.js';
import { ApiError, getApiErrorResponse } from '../../utils/apiError.js';
import { UserKeyRepository } from '../../resources/user-keys/userKey.repository.js';
import { RelationsHandler } from './relations.handler.js';
import type { CreateRelationInput, RelationDto, UpdateRelationInput } from './relations.types.js';

export class RelationsController {
  static async getRelations(): Promise<ApiResponse<RelationDto[]>> {
    const userKeyId = await chayns.person.current.getId();

    if (!await UserKeyRepository.validate(userKeyId)) {
      return { status: 401, body: { message: 'Not registered' } };
    }

    try {
      const relations = await RelationsHandler.getRelationsByUserKey(userKeyId);
      return { status: 200, body: relations };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }

  static async addRelation(
    ctx: ApiRequest<CreateRelationInput>,
  ): Promise<ApiResponse<RelationDto>> {
    const userKeyId = await chayns.person.current.getId();
    const body = ctx.body;

    if (!await UserKeyRepository.validate(userKeyId)) {
      return { status: 401, body: { message: 'Not registered' } };
    }

    if (!body) {
      return { status: 400, body: { message: 'No data in body provided' } };
    }

    try {
      const relation = await RelationsHandler.createRelation(userKeyId, body);
      return { status: 201, body: relation };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }

  static async updateRelation(
    ctx: ApiRequest<UpdateRelationInput, undefined, { id: string }>,
  ): Promise<ApiResponse<RelationDto>> {
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
      const result = await RelationsHandler.updateRelation(id, userKeyId, body);
      return { status: 200, body: result };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }

  static async deleteRelation(
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
      await RelationsHandler.deleteRelation(id, userKeyId);
      return { status: 204 };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }
}
