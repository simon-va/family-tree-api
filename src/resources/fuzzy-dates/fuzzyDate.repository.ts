import { Storage } from '../../utils/storage.js';
import { STORAGE_KEYS } from '../../utils/storageKeys.js';
import type { FuzzyDateResource } from './fuzzyDate.model.js';

export class FuzzyDateRepository {
  static async findAll(): Promise<FuzzyDateResource[]> {
    return (await Storage.get<FuzzyDateResource[]>(STORAGE_KEYS.fuzzyDates)) ?? [];
  }

  static async findById(id: string): Promise<FuzzyDateResource | undefined> {
    const all = await FuzzyDateRepository.findAll();
    return all.find((d) => d.id === id);
  }

  static async save(fuzzyDate: FuzzyDateResource): Promise<FuzzyDateResource> {
    return Storage.add<FuzzyDateResource>(STORAGE_KEYS.fuzzyDates, fuzzyDate);
  }

  static async update(fuzzyDate: FuzzyDateResource): Promise<FuzzyDateResource> {
    return Storage.update<FuzzyDateResource>(STORAGE_KEYS.fuzzyDates, fuzzyDate);
  }

  static async delete(id: string): Promise<void> {
    return Storage.remove<FuzzyDateResource>(STORAGE_KEYS.fuzzyDates, id);
  }
}
