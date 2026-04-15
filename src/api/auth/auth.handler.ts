import type { UserKeyResource } from '../../resources/user-keys/userKey.model.js';
import { UserKeyRepository } from '../../resources/user-keys/userKey.repository.js';
import { ApiError } from '../../utils/apiError.js';
import { Storage } from '../../utils/storage.js';
import { STORAGE_KEYS } from '../../utils/storageKeys.js';

export class AuthHandler {
  static async login(): Promise<UserKeyResource> {
    const personId = await chayns.person.current.getId();
    const userKey = await UserKeyRepository.findById(personId);

    if (!userKey) {
      throw new ApiError(404, 'User not found');
    }

    return userKey;
  }

  static async register(): Promise<UserKeyResource> {
    const enabled = await Storage.get<boolean>(STORAGE_KEYS.userKeyCreationEnabled);

    if (enabled === false) {
      throw new ApiError(403, 'Registration is disabled');
    }

    const userKeyId = await chayns.person.current.getId();

    if (await UserKeyRepository.validate(userKeyId)) {
      throw new ApiError(409, 'Already registered');
    }

    const { firstName, lastName } = await chayns.person.getPublicInformation(userKeyId);
    const userKey: UserKeyResource = { id: userKeyId, firstName, lastName };
    return UserKeyRepository.save(userKey);
  }
}
