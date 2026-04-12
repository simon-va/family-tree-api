import { UserKeyResource } from "../user-keys/userKey.model";

export type Gender = 'male' | 'female' | 'diverse';

export interface PersonResource {
  id: string;
  userKeyId: UserKeyResource['id'];
  firstName: string;
  lastName: string;
  middleNames?: string;
  birthName?: string;
  gender?: Gender;
  birthPlace?: string;
  birthDateId?: string;
  deathPlace?: string;
  deathDateId?: string;
  burialPlace?: string;
  title?: string;
  religion?: string;
  notes?: string;
}
