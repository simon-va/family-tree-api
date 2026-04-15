import type { ApiRequest, ApiResponse } from '../../utils/api.types.js';
import { ApiError, getApiErrorResponse } from '../../utils/apiError.js';
import { UserKeyRepository } from '../../resources/user-keys/userKey.repository.js';
import { PersonsHandler } from './persons.handler.js';
import type { CreatePersonInput, PersonDto, UpdatePersonInput } from './persons.types.js';

export class PersonsController {
  static async getPersons(): Promise<ApiResponse<PersonDto[]>> {
    const userKeyId = await chayns.person.current.getId();

    if (!await UserKeyRepository.validate(userKeyId)) {
      return { status: 401, body: { message: 'Not registered' } };
    }

    try {
      const persons = await PersonsHandler.getPersonsByUserKey(userKeyId);
      return { status: 200, body: persons };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }

  static async addPerson(
    ctx: ApiRequest<CreatePersonInput>,
  ): Promise<ApiResponse<PersonDto>> {
    const userKeyId = await chayns.person.current.getId();
    const body = ctx.body;

    if (!await UserKeyRepository.validate(userKeyId)) {
      return { status: 401, body: { message: 'Not registered' } };
    }

    if (!body) {
      return { status: 400, body: { message: 'No data in body provided' } };
    }

    try {
      const person = await PersonsHandler.createPerson(userKeyId, body);
      return { status: 201, body: person };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }

  static async updatePerson(
    ctx: ApiRequest<UpdatePersonInput, undefined, { id: string }>,
  ): Promise<ApiResponse<PersonDto>> {
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
      const result = await PersonsHandler.updatePerson(id, userKeyId, body);
      return { status: 200, body: result };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }

  static async deletePerson(
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
      await PersonsHandler.deletePerson(id, userKeyId);
      return { status: 204 };
    } catch (error) {
      if (error instanceof ApiError) {
        return getApiErrorResponse(error);
      }

      throw error;
    }
  }
}
