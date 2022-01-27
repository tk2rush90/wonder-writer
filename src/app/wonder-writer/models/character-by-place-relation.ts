import {Character} from './character';
import {Place} from './place';

export interface CharacterByPlaceRelation {
  // Relation id.
  id: string;
  // Character id.
  characterId: string;
  // Place id.
  placeId: string;
  // Character info.
  character?: Character;
  // Place info.
  place?: Place;
  // Relation info.
  relation: string;
  // Relation memo.
  memo: string;
}
