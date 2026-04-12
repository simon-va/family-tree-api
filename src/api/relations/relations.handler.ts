import { FuzzyDateRepository } from '../../resources/fuzzy-dates/fuzzyDate.repository.js';
import type { RelationshipResource } from '../../resources/relations/relation.model.js';
import { RelationRepository } from '../../resources/relations/relation.repository.js';
import { ApiError } from '../../utils/apiError.js';
import type { CreateRelationInput, RelationDto, UpdateRelationInput } from './relations.types.js';

export class RelationsHandler {
  static async getRelationsByUserKey(userKey: string): Promise<RelationDto[]> {
    const relations = await RelationRepository.findByUserKey(userKey);
    const allFuzzyDates = await FuzzyDateRepository.findAll();
    const fuzzyDatesById = Object.fromEntries(allFuzzyDates.map((d) => [d.id, d]));

    return relations.map(({ startDateId, endDateId, userKeyId, ...relation }) => ({
      ...relation,
      startDate: startDateId ? fuzzyDatesById[startDateId] : undefined,
      endDate: endDateId ? fuzzyDatesById[endDateId] : undefined,
    }));
  }

  static async createRelation(userKey: string, input: CreateRelationInput): Promise<RelationDto> {
    const startDate = input.startDate
      ? await FuzzyDateRepository.save({ id: crypto.randomUUID(), ...input.startDate })
      : undefined;

    const endDate = input.endDate
      ? await FuzzyDateRepository.save({ id: crypto.randomUUID(), ...input.endDate })
      : undefined;

    const { startDate: _startDate, endDate: _endDate, ...relationData } = input;

    const data: RelationshipResource = {
      id: crypto.randomUUID(),
      userKeyId: userKey,
      ...relationData,
      startDateId: startDate?.id,
      endDateId: endDate?.id,
    };

    const {
      startDateId: _startDateId,
      endDateId: _endDateId,
      userKeyId: _userKeyId,
      ...relation
    } = await RelationRepository.save(data);

    return {
      ...relation,
      startDate,
      endDate,
    };
  }

  static async updateRelation(
    id: string,
    userKey: string,
    input: UpdateRelationInput,
  ): Promise<RelationDto> {
    const existing = await RelationRepository.findById(id);

    if (!existing || existing.userKeyId !== userKey) {
      throw new ApiError(404, 'Relation not found');
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

    const { startDate: _startDate, endDate: _endDate, ...relationData } = input;

    const {
      startDateId: _startDateId,
      endDateId: _endDateId,
      userKeyId: _userKeyId,
      ...relation
    } = await RelationRepository.update({
      id,
      userKeyId: userKey,
      ...relationData,
      startDateId: startDate?.id,
      endDateId: endDate?.id,
    });

    return { ...relation, startDate, endDate };
  }

  static async deleteRelation(id: string, userKey: string): Promise<void> {
    const relation = await RelationRepository.findById(id);

    if (!relation || relation.userKeyId !== userKey) {
      throw new ApiError(404, 'Relation not found');
    }

    await RelationRepository.delete(id);

    if (relation.startDateId) {
      await FuzzyDateRepository.delete(relation.startDateId);
    }

    if (relation.endDateId) {
      await FuzzyDateRepository.delete(relation.endDateId);
    }
  }
}
