import { FuzzyDateRepository } from '../fuzzy-dates/fuzzyDate.repository.js';
import { Storage } from '../../utils/storage.js';
import { STORAGE_KEYS } from '../../utils/storageKeys.js';
import type { ResidenceResource } from './residence.model.js';

export class ResidenceRepository {
  static async findAll(): Promise<ResidenceResource[]> {
    return (await Storage.get<ResidenceResource[]>(STORAGE_KEYS.residences)) ?? [];
  }

  static async findById(id: string): Promise<ResidenceResource | undefined> {
    const all = await ResidenceRepository.findAll();
    return all.find((r) => r.id === id);
  }

  static async findByUserKey(userKeyId: string): Promise<ResidenceResource[]> {
    const all = await ResidenceRepository.findAll();
    return all.filter((r) => r.userKeyId === userKeyId);
  }

  static async save(residence: ResidenceResource): Promise<ResidenceResource> {
    return Storage.add<ResidenceResource>(STORAGE_KEYS.residences, residence);
  }

  static async update(residence: ResidenceResource): Promise<ResidenceResource> {
    return Storage.update<ResidenceResource>(STORAGE_KEYS.residences, residence);
  }

  static async delete(id: string): Promise<void> {
    const residence = await ResidenceRepository.findById(id);
    if (residence) {
      if (residence.startDateId) await FuzzyDateRepository.delete(residence.startDateId);
      if (residence.endDateId) await FuzzyDateRepository.delete(residence.endDateId);
    }
    await Storage.remove<ResidenceResource>(STORAGE_KEYS.residences, id);

    const all = await ResidenceRepository.findAll();
    const referencing = all.filter((r) => r.movedToResidenceId === id);
    for (const r of referencing) {
      await ResidenceRepository.update({ ...r, movedToResidenceId: undefined });
    }
  }
}
