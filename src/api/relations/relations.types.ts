import type { FuzzyDateFieldPrecision, FuzzyDateResource } from '../../resources/fuzzy-dates/fuzzyDate.model.js';
import type { RelationshipResource } from '../../resources/relations/relation.model.js';

export interface CreateFuzzyDateInput {
  precision: FuzzyDateResource['precision'];
  date: string;
  datePrecision?: FuzzyDateFieldPrecision;
  dateTo?: string;
  dateToPrecision?: FuzzyDateFieldPrecision;
  note?: string;
}

export type CreateRelationInput = Omit<
  RelationshipResource,
  'id' | 'userKeyId' | 'startDateId' | 'endDateId'
> & {
  startDate?: CreateFuzzyDateInput;
  endDate?: CreateFuzzyDateInput;
};

export type UpdateRelationInput = CreateRelationInput;

export type RelationDto = Omit<
  RelationshipResource,
  'userKeyId' | 'startDateId' | 'endDateId'
> & {
  startDate?: FuzzyDateResource;
  endDate?: FuzzyDateResource;
};
