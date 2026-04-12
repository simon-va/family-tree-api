import { FuzzyDateResource } from '../../resources/fuzzy-dates/fuzzyDate.model.js';
import { PersonResource } from '../../resources/persons/person.model.js';
import { RelationshipResource } from '../../resources/relations/relation.model.js';
import { ResidenceResource } from '../../resources/residences/residence.model.js';
import { UserKeyResource } from '../../resources/user-keys/userKey.model.js';
import { Storage } from '../../utils/storage.js';
import { STORAGE_KEYS } from '../../utils/storageKeys.js';
import { AdminDataDto, AdminDataQuery } from './admin.types.js';

export class AdminHandler {
  static async getData(flags: Omit<AdminDataQuery, 'password'>): Promise<AdminDataDto> {
    const result: AdminDataDto = {};

    if (flags.userKeys === 'true') result.userKeys = (await Storage.get<UserKeyResource[]>(STORAGE_KEYS.userKeys));
    if (flags.fuzzyDates === 'true') result.fuzzyDates = (await Storage.get<FuzzyDateResource[]>(STORAGE_KEYS.fuzzyDates));
    if (flags.persons === 'true') result.persons = (await Storage.get<PersonResource[]>(STORAGE_KEYS.persons));
    if (flags.relations === 'true') result.relations = (await Storage.get<RelationshipResource[]>(STORAGE_KEYS.relations));
    if (flags.residences === 'true') result.residences = (await Storage.get<ResidenceResource[]>(STORAGE_KEYS.residences));

    return result;
  }

  static async deleteData(flags: Omit<AdminDataQuery, 'password'>): Promise<void> {
    if (flags.userKeys === 'true') await Storage.set(STORAGE_KEYS.userKeys, []);
    if (flags.fuzzyDates === 'true') await Storage.set(STORAGE_KEYS.fuzzyDates, []);
    if (flags.persons === 'true') await Storage.set(STORAGE_KEYS.persons, []);
    if (flags.relations === 'true') await Storage.set(STORAGE_KEYS.relations, []);
    if (flags.residences === 'true') await Storage.set(STORAGE_KEYS.residences, []);
  }

  static async setUserKeyCreation(enabled: boolean): Promise<void> {
    await Storage.set(STORAGE_KEYS.userKeyCreationEnabled, enabled);
  }
}
