import type { FuzzyDateResource } from '../../resources/fuzzy-dates/fuzzyDate.model.js';
import type { ResidenceResource } from '../../resources/residences/residence.model.js';

export interface CreateFuzzyDateInput {
  precision: FuzzyDateResource['precision'];
  date: string;
  dateTo?: string;
  note?: string;
}

export type CreateResidenceInput = Omit<
  ResidenceResource,
  'id' | 'userKeyId' | 'startDateId' | 'endDateId'
> & {
  startDate?: CreateFuzzyDateInput;
  endDate?: CreateFuzzyDateInput;
};

export type UpdateResidenceInput = CreateResidenceInput;

export type ResidenceDto = Omit<
  ResidenceResource,
  'userKeyId' | 'startDateId' | 'endDateId'
> & {
  startDate?: FuzzyDateResource;
  endDate?: FuzzyDateResource;
};
