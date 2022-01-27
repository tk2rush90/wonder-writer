import {Character} from './character';

export interface CharacterByCharacterRelation {
  // Relation id.
  id: string;
  // Main character id.
  fromCharacterId: string;
  // Related character id.
  toCharacterId: string;
  // Main character info.
  from?: Character;
  // Related character info.
  to?: Character;
  // Relation info.
  relation: string;
  // Relation memo.
  memo: string;
}
