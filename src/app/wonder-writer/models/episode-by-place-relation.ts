import {Episode} from './episode';
import {Place} from './place';

export interface EpisodeByPlaceRelation {
  // Relation id.
  id: string;
  // Episode id.
  episodeId: string;
  // Place id.
  placeId: string;
  // Episode info.
  episode?: Episode;
  // Place info.
  place?: Place;
  // Relation info.
  relation: string;
  // Relation memo.
  memo: string;
}
