import type { UserKeyResource } from '../user-keys/userKey.model.js';

export interface ResidenceResource {
  id: string;
  userKeyId: UserKeyResource['id'];
  personId: string;
  city?: string;
  country?: string;
  street?: string;
  notes?: string;
  startDateId?: string;
  endDateId?: string;
}
