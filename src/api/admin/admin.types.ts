import { FuzzyDateResource } from "../../resources/fuzzy-dates/fuzzyDate.model";
import { PersonResource } from "../../resources/persons/person.model";
import { RelationshipResource } from "../../resources/relations/relation.model";
import { ResidenceResource } from "../../resources/residences/residence.model";
import { UserKeyResource } from "../../resources/user-keys/userKey.model";

export type AdminUserKeyCreationQuery = {
  password: string;
};

export type AdminUserKeyCreationInput = {
  enabled: boolean;
};

export type AdminDataQuery = {
  password: string;
  userKeys?: string;
  fuzzyDates?: string;
  persons?: string;
  relations?: string;
  residences?: string;
};

export type AdminDataDto = {
  userKeys?: UserKeyResource[];
  fuzzyDates?: FuzzyDateResource[];
  persons?: PersonResource[];
  relations?: RelationshipResource[];
  residences?: ResidenceResource[];
};
