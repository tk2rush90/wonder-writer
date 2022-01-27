import {Episode} from './episode';
import {Character} from './character';

export interface EpisodeByCharacterRelation {
  // Relation id.
  id: string;
  // Episode id.
  episodeId: string;
  // Character id.
  characterId: string;
  // Episode info.
  episode?: Episode;
  // Character info.
  character?: Character;
  // Relation info.
  relation: string;
  // Relation memo.
  memo: string;
}
