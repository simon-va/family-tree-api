import type { UserKeyResource } from '../../resources/user-keys/userKey.model.js';
import { UserKeyRepository } from '../../resources/user-keys/userKey.repository.js';
import { ApiError } from '../../utils/apiError.js';
import { Storage } from '../../utils/storage.js';
import { STORAGE_KEYS } from '../../utils/storageKeys.js';

export class AuthHandler {
  static async generateUserKey(): Promise<UserKeyResource> {
    const enabled = await Storage.get<boolean>(STORAGE_KEYS.userKeyCreationEnabled);

    if (enabled === false) {
      throw new ApiError(403, 'User key creation is disabled');
    }

    const userKey: UserKeyResource = { id: crypto.randomUUID() };
    return UserKeyRepository.save(userKey);
  }
}
