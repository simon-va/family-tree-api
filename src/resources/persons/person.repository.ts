import { Storage } from '../../utils/storage.js';
import { STORAGE_KEYS } from '../../utils/storageKeys.js';
import type { PersonResource } from './person.model.js';

export class PersonRepository {
  static async findAll(): Promise<PersonResource[]> {
    return (await Storage.get<PersonResource[]>(STORAGE_KEYS.persons)) ?? [];
  }

  static async findById(id: string): Promise<PersonResource | undefined> {
    const all = await PersonRepository.findAll();
    return all.find((p) => p.id === id);
  }

  static async findByUserKey(userKeyId: string): Promise<PersonResource[]> {
    const all = await PersonRepository.findAll();
    return all.filter((p) => p.userKeyId === userKeyId);
  }

  static async save(person: PersonResource): Promise<PersonResource> {
    return Storage.add<PersonResource>(STORAGE_KEYS.persons, person);
  }

  static async update(person: PersonResource): Promise<PersonResource> {
    return Storage.update<PersonResource>(STORAGE_KEYS.persons, person);
  }

  static async delete(id: string): Promise<void> {
    return Storage.remove<PersonResource>(STORAGE_KEYS.persons, id);
  }
}
