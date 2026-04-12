import { FuzzyDateRepository } from '../../resources/fuzzy-dates/fuzzyDate.repository.js';
import { PersonRepository } from '../../resources/persons/person.repository.js';
import type { ResidenceResource } from '../../resources/residences/residence.model.js';
import { ResidenceRepository } from '../../resources/residences/residence.repository.js';
import { ApiError } from '../../utils/apiError.js';
import type { CreateResidenceInput, ResidenceDto, UpdateResidenceInput } from './residences.types.js';

export class ResidencesHandler {
  static async getResidencesByUserKey(userKey: string): Promise<ResidenceDto[]> {
    const residences = await ResidenceRepository.findByUserKey(userKey);
    const allFuzzyDates = await FuzzyDateRepository.findAll();
    const fuzzyDatesById = Object.fromEntries(allFuzzyDates.map((d) => [d.id, d]));

    return residences.map(({ startDateId, endDateId, userKeyId, ...residence }) => ({
      ...residence,
      startDate: startDateId ? fuzzyDatesById[startDateId] : undefined,
      endDate: endDateId ? fuzzyDatesById[endDateId] : undefined,
    }));
  }

  static async createResidence(
    userKey: string,
    input: CreateResidenceInput,
  ): Promise<ResidenceDto> {
    const person = await PersonRepository.findById(input.personId);

    if (!person || person.userKeyId !== userKey) {
      throw new ApiError(404, 'Person not found');
    }

    const startDate = input.startDate
      ? await FuzzyDateRepository.save({ id: crypto.randomUUID(), ...input.startDate })
      : undefined;

    const endDate = input.endDate
      ? await FuzzyDateRepository.save({ id: crypto.randomUUID(), ...input.endDate })
      : undefined;

    const { startDate: _startDate, endDate: _endDate, ...residenceData } = input;

    const data: ResidenceResource = {
      id: crypto.randomUUID(),
      userKeyId: userKey,
      ...residenceData,
      startDateId: startDate?.id,
      endDateId: endDate?.id,
    };

    const {
      startDateId: _startDateId,
      endDateId: _endDateId,
      userKeyId: _userKeyId,
      ...residence
    } = await ResidenceRepository.save(data);

    return {
      ...residence,
      startDate,
      endDate,
    };
  }

  static async updateResidence(
    id: string,
    userKey: string,
    input: UpdateResidenceInput,
  ): Promise<ResidenceDto> {
    const existing = await ResidenceRepository.findById(id);

    if (!existing || existing.userKeyId !== userKey) {
      throw new ApiError(404, 'Residence not found');
    }

    let startDate = undefined;
    if (input.startDate) {
      if (existing.startDateId) {
        startDate = await FuzzyDateRepository.update({ id: existing.startDateId, ...input.startDate });
      } else {
        startDate = await FuzzyDateRepository.save({ id: crypto.randomUUID(), ...input.startDate });
      }
    } else if (existing.startDateId) {
      await FuzzyDateRepository.delete(existing.startDateId);
    }

    let endDate = undefined;
    if (input.endDate) {
      if (existing.endDateId) {
        endDate = await FuzzyDateRepository.update({ id: existing.endDateId, ...input.endDate });
      } else {
        endDate = await FuzzyDateRepository.save({ id: crypto.randomUUID(), ...input.endDate });
      }
    } else if (existing.endDateId) {
      await FuzzyDateRepository.delete(existing.endDateId);
    }

    const { startDate: _startDate, endDate: _endDate, ...residenceData } = input;

    const {
      startDateId: _startDateId,
      endDateId: _endDateId,
      userKeyId: _userKeyId,
      ...residence
    } = await ResidenceRepository.update({
      id,
      userKeyId: userKey,
      ...residenceData,
      startDateId: startDate?.id,
      endDateId: endDate?.id,
    });

    return { ...residence, startDate, endDate };
  }

  static async deleteResidence(id: string, userKey: string): Promise<void> {
    const residence = await ResidenceRepository.findById(id);

    if (!residence || residence.userKeyId !== userKey) {
      throw new ApiError(404, 'Residence not found');
    }

    await ResidenceRepository.delete(id);

    if (residence.startDateId) {
      await FuzzyDateRepository.delete(residence.startDateId);
    }

    if (residence.endDateId) {
      await FuzzyDateRepository.delete(residence.endDateId);
    }
  }
}
