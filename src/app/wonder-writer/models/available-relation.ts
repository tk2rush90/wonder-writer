import {CharacterByCharacterRelation} from '@wonder-writer/models/character-by-character-relation';
import {CharacterByPlaceRelation} from '@wonder-writer/models/character-by-place-relation';
import {EpisodeByCharacterRelation} from '@wonder-writer/models/episode-by-character-relation';
import {EpisodeByPlaceRelation} from '@wonder-writer/models/episode-by-place-relation';

export type AvailableRelation =
  CharacterByCharacterRelation
  | CharacterByPlaceRelation
  | EpisodeByCharacterRelation
  | EpisodeByPlaceRelation;
