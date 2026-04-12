import { Storage } from '../../utils/storage.js';
import { STORAGE_KEYS } from '../../utils/storageKeys.js';
import type { RelationshipResource } from './relation.model.js';

export class RelationRepository {
  static async findAll(): Promise<RelationshipResource[]> {
    return (await Storage.get<RelationshipResource[]>(STORAGE_KEYS.relations)) ?? [];
  }

  static async findById(id: string): Promise<RelationshipResource | undefined> {
    const all = await RelationRepository.findAll();
    return all.find((r) => r.id === id);
  }

  static async findByUserKey(userKeyId: string): Promise<RelationshipResource[]> {
    const all = await RelationRepository.findAll();
    return all.filter((r) => r.userKeyId === userKeyId);
  }

  static async save(relation: RelationshipResource): Promise<RelationshipResource> {
    return Storage.add<RelationshipResource>(STORAGE_KEYS.relations, relation);
  }

  static async update(relation: RelationshipResource): Promise<RelationshipResource> {
    return Storage.update<RelationshipResource>(STORAGE_KEYS.relations, relation);
  }

  static async delete(id: string): Promise<void> {
    return Storage.remove<RelationshipResource>(STORAGE_KEYS.relations, id);
  }
}
