import type {
  FuzzyDatePrecision,
} from '../../resources/fuzzy-dates/fuzzyDate.model.js';
import type { PersonResource } from '../../resources/persons/person.model.js';

export interface CreateFuzzyDateInput {
  precision: FuzzyDatePrecision;
  date: string;
  dateTo?: string;
  note?: string;
}

export type CreatePersonInput = Omit<
  PersonResource,
  'id' | 'userKeyId' | 'birthDateId' | 'deathDateId'
> & {
  birthDate?: CreateFuzzyDateInput;
  deathDate?: CreateFuzzyDateInput;
};

export type UpdatePersonInput = CreatePersonInput;

export type PersonDto = Omit<PersonResource, 'userKeyId' | 'birthDateId' | 'deathDateId'> & {
  birthDate?: CreateFuzzyDateInput;
  deathDate?: CreateFuzzyDateInput;
};
