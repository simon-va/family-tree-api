export type FuzzyDatePrecision =
  | 'exact'
  | 'month'
  | 'year'
  | 'estimated'
  | 'before'
  | 'after'
  | 'between';

export type FuzzyDateFieldPrecision = 'exact' | 'month' | 'year';

export interface FuzzyDateResource {
  id: string;
  precision: FuzzyDatePrecision;
  date: string;
  datePrecision?: FuzzyDateFieldPrecision; // default: 'exact', relevant for estimated, before, after, between
  dateTo?: string;                          // only with "between"
  dateToPrecision?: FuzzyDateFieldPrecision; // default: 'exact', only with "between"
  note?: string;
}
