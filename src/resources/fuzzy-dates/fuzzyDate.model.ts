export type FuzzyDatePrecision =
  | 'exact'
  | 'month'
  | 'year'
  | 'about'
  | 'estimated'
  | 'before'
  | 'after'
  | 'between';

export interface FuzzyDateResource {
  id: string;
  precision: FuzzyDatePrecision;
  date: string;
  dateTo?: string; // only with "between"
  note?: string;
}
