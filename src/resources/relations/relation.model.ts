import type { UserKeyResource } from '../user-keys/userKey.model.js';

export type RelationshipType =
  | 'biological_parent'
  | 'adoptive_parent'
  | 'foster_parent'
  | 'spouse'
  | 'partner'
  | 'engaged';

export interface RelationshipResource {
  id: string;
  userKeyId: UserKeyResource['id'];
  personAId: string;
  personBId: string;
  type: RelationshipType;
  startDateId?: string;
  endDateId?: string;
  endReason?: string;
  notes: string;
}
