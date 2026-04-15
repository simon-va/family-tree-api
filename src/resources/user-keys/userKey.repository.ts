import { Storage } from '../../utils/storage.js';
import { STORAGE_KEYS } from '../../utils/storageKeys.js';
import type { UserKeyResource } from './userKey.model.js';

export class UserKeyRepository {
  static async save(userKey: UserKeyResource): Promise<UserKeyResource> {
    return Storage.add<UserKeyResource>(STORAGE_KEYS.userKeys, userKey);
  }

  static async validate(personId: string): Promise<boolean> {
    const list = (await Storage.get<UserKeyResource[]>(STORAGE_KEYS.userKeys)) ?? [];
    return list.some((entry) => entry.id === personId);
  }

  static async findById(personId: string): Promise<UserKeyResource | undefined> {
    const list = (await Storage.get<UserKeyResource[]>(STORAGE_KEYS.userKeys)) ?? [];
    return list.find((entry) => entry.id === personId);
  }
}
