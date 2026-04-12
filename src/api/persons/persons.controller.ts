import type { ApiRequest, ApiResponse } from '../../utils/api.types.js';
import { ApiError, getApiErrorResponse } from '../../utils/apiError.js';
import { UserKeyRepository } from '../../resources/user-keys/userKey.repository.js';
import { PersonsHandler } from './persons.handler.js';
import type { CreatePersonInput, PersonDto, UpdatePersonInput } from './persons.types.js';

export class PersonsController {
  static async getPersons(
    ctx: ApiRequest<undefined, { userKey: string }>,
  ): Promise<ApiResponse<PersonDto[]>> {
    const userKey = ctx.query?.userKey;

    if (!userKey) {
      return { status: 400, body: { message: 'No userKey in query parameters provided' } };
    }

    if (!await UserKeyRepository.validate(userKey)) {
      return { status: 401, body: { message: 'Invalid userKey' } };
    }

    try {
      const persons = await PersonsHandler.getPersonsByUserKey(userKey);
      return { status: 200, body: persons };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }

  static async addPerson(
    ctx: ApiRequest<CreatePersonInput, { userKey: string }>,
  ): Promise<ApiResponse<PersonDto>> {
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
      const person = await PersonsHandler.createPerson(userKey, body);
      return { status: 201, body: person };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }

  static async updatePerson(
    ctx: ApiRequest<UpdatePersonInput, { userKey: string }, { id: string }>,
  ): Promise<ApiResponse<PersonDto>> {
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
      const result = await PersonsHandler.updatePerson(id, userKey, body);
      return { status: 200, body: result };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }

  static async deletePerson(
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
      await PersonsHandler.deletePerson(id, userKey);
      return { status: 204 };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }
}
