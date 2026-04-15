import { FuzzyDateRepository } from '../../resources/fuzzy-dates/fuzzyDate.repository.js';
import type { PersonResource } from '../../resources/persons/person.model.js';
import { PersonRepository } from '../../resources/persons/person.repository.js';
import { ApiError } from '../../utils/apiError.js';
import type { CreatePersonInput, PersonDto, UpdatePersonInput } from './persons.types.js';

export class PersonsHandler {
  static async getPersonsByUserKey(userKeyId: string): Promise<PersonDto[]> {
    const persons = await PersonRepository.findByUserKey(userKeyId);
    const allFuzzyDates = await FuzzyDateRepository.findAll();
    const fuzzyDatesById = Object.fromEntries(allFuzzyDates.map((d) => [d.id, d]));

    return persons.map(({ birthDateId, deathDateId, userKeyId, ...person }) => ({
      ...person,
      birthDate: birthDateId ? fuzzyDatesById[birthDateId] : undefined,
      deathDate: deathDateId ? fuzzyDatesById[deathDateId] : undefined,
    }));
  }

  static async createPerson(userKeyId: string, input: CreatePersonInput): Promise<PersonDto> {
    const birthDate = input.birthDate
      ? await FuzzyDateRepository.save({ id: crypto.randomUUID(), ...input.birthDate })
      : undefined;

    const deathDate = input.deathDate
      ? await FuzzyDateRepository.save({ id: crypto.randomUUID(), ...input.deathDate })
      : undefined;

    const { birthDate: _birthDate, deathDate: _deathDate, ...personData } = input;

    const data: PersonResource = {
      id: crypto.randomUUID(),
      userKeyId,
      ...personData,
      birthDateId: birthDate?.id,
      deathDateId: deathDate?.id,
    };

    const {
      birthDateId: _birthDateId,
      deathDateId: _deathDateId,
      userKeyId: _userKeyId,
      ...person
    } = await PersonRepository.save(data);

    return {
      ...person,
      birthDate,
      deathDate,
    };
  }

  static async updatePerson(
    id: string,
    userKeyId: string,
    input: UpdatePersonInput,
  ): Promise<PersonDto> {
    const existing = await PersonRepository.findById(id);

    if (!existing || existing.userKeyId !== userKeyId) {
      throw new ApiError(404, 'Person not found');
    }

    let birthDate = undefined;
    if (input.birthDate) {
      if (existing.birthDateId) {
        birthDate = await FuzzyDateRepository.update({ id: existing.birthDateId, ...input.birthDate });
      } else {
        birthDate = await FuzzyDateRepository.save({ id: crypto.randomUUID(), ...input.birthDate });
      }
    } else if (existing.birthDateId) {
      await FuzzyDateRepository.delete(existing.birthDateId);
    }

    let deathDate = undefined;
    if (input.deathDate) {
      if (existing.deathDateId) {
        deathDate = await FuzzyDateRepository.update({ id: existing.deathDateId, ...input.deathDate });
      } else {
        deathDate = await FuzzyDateRepository.save({ id: crypto.randomUUID(), ...input.deathDate });
      }
    } else if (existing.deathDateId) {
      await FuzzyDateRepository.delete(existing.deathDateId);
    }

    const { birthDate: _birthDate, deathDate: _deathDate, ...personData } = input;

    const {
      birthDateId: _birthDateId,
      deathDateId: _deathDateId,
      userKeyId: _userKeyId,
      ...person
    } = await PersonRepository.update({
      id,
      userKeyId,
      ...personData,
      birthDateId: birthDate?.id,
      deathDateId: deathDate?.id,
    });

    return { ...person, birthDate, deathDate };
  }

  static async deletePerson(id: string, userKeyId: string): Promise<void> {
    const person = await PersonRepository.findById(id);

    if (!person || person.userKeyId !== userKeyId) {
      throw new ApiError(404, 'Person not found');
    }

    await PersonRepository.delete(id);

    if (person.birthDateId) {
      await FuzzyDateRepository.delete(person.birthDateId);
    }

    if (person.deathDateId) {
      await FuzzyDateRepository.delete(person.deathDateId);
    }
  }
}
