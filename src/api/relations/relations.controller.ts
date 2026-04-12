import type { ApiRequest, ApiResponse } from '../../utils/api.types.js';
import { ApiError, getApiErrorResponse } from '../../utils/apiError.js';
import { UserKeyRepository } from '../../resources/user-keys/userKey.repository.js';
import { RelationsHandler } from './relations.handler.js';
import type { CreateRelationInput, RelationDto, UpdateRelationInput } from './relations.types.js';

export class RelationsController {
  static async getRelations(
    ctx: ApiRequest<undefined, { userKey: string }>,
  ): Promise<ApiResponse<RelationDto[]>> {
    const userKey = ctx.query?.userKey;

    if (!userKey) {
      return { status: 400, body: { message: 'No userKey in query parameters provided' } };
    }

    if (!await UserKeyRepository.validate(userKey)) {
      return { status: 401, body: { message: 'Invalid userKey' } };
    }

    try {
      const relations = await RelationsHandler.getRelationsByUserKey(userKey);
      return { status: 200, body: relations };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }

  static async addRelation(
    ctx: ApiRequest<CreateRelationInput, { userKey: string }>,
  ): Promise<ApiResponse<RelationDto>> {
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
      const relation = await RelationsHandler.createRelation(userKey, body);
      return { status: 201, body: relation };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }

  static async updateRelation(
    ctx: ApiRequest<UpdateRelationInput, { userKey: string }, { id: string }>,
  ): Promise<ApiResponse<RelationDto>> {
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
      const result = await RelationsHandler.updateRelation(id, userKey, body);
      return { status: 200, body: result };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }

  static async deleteRelation(
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
      await RelationsHandler.deleteRelation(id, userKey);
      return { status: 204 };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }
}
