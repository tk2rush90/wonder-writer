import {Injectable} from '@angular/core';
import {DbService} from '@wonder-writer/services/db/db.service';
import {CharacterStoreService} from '@wonder-writer/services/db/character-store.service';
import {PlaceStoreService} from '@wonder-writer/services/db/place-store.service';
import {EpisodeStoreService} from '@wonder-writer/services/db/episode-store.service';
import {Character} from '@wonder-writer/models/character';
import {HierarchyStoreService} from '@wonder-writer/services/db/hierarchy-store.service';
import {SortUtil} from '@tk-ui/utils/sort.util';
import {HierarchyItem, HierarchyType} from '@wonder-writer/models/hierarchy-item';
import {Place} from '@wonder-writer/models/place';
import {Episode} from '@wonder-writer/models/episode';
import {CharacterByCharacterRelation} from '@wonder-writer/models/character-by-character-relation';
import {
  CharacterByCharacterRelationStoreService
} from '@wonder-writer/services/db/character-by-character-relation-store.service';
import {
  CharacterByPlaceRelationStoreService
} from '@wonder-writer/services/db/character-by-place-relation-store.service';
import {
  EpisodeByCharacterRelationStoreService
} from '@wonder-writer/services/db/episode-by-character-relation-store.service';
import {EpisodeByPlaceRelationStoreService} from '@wonder-writer/services/db/episode-by-place-relation-store.service';
import {CharacterByPlaceRelation} from '@wonder-writer/models/character-by-place-relation';
import {EpisodeByCharacterRelation} from '@wonder-writer/models/episode-by-character-relation';
import {EpisodeByPlaceRelation} from '@wonder-writer/models/episode-by-place-relation';
import {AvailableRelation} from '@wonder-writer/models/available-relation';
import {IndexedDbUtil} from '@tk-ui/utils/indexed-db.util';
import {lastValueFrom, Observable} from 'rxjs';

/**
 * This is relation joint store to do some complicated actions
 */
@Injectable({
  providedIn: 'root'
})
export class RelationJointStoreService {

  constructor(
    private dbService: DbService,
    private hierarchyStoreService: HierarchyStoreService,
    private characterStoreService: CharacterStoreService,
    private placeStoreService: PlaceStoreService,
    private episodeStoreService: EpisodeStoreService,
    private characterByCharacterRelationStoreService: CharacterByCharacterRelationStoreService,
    private characterByPlaceRelationStoreService: CharacterByPlaceRelationStoreService,
    private episodeByCharacterRelationStoreService: EpisodeByCharacterRelationStoreService,
    private episodeByPlaceRelationStoreService: EpisodeByPlaceRelationStoreService,
  ) {
  }

  /**
   * Return all characters in project in flat.
   * @param projectId project id
   */
  async getAllCharactersByProjectId(projectId: string): Promise<Character[]> {
    const hierarchies = await this._getSortedHierarchiesByProjectId(projectId, 'character');

    const promises = hierarchies.map(async (hierarchy) => {
      return await this.characterStoreService.getCharacterByHierarchy(hierarchy);
    });

    return await Promise.all(promises);
  }

  /**
   * Return all places in project in flat.
   * @param projectId project id
   */
  async getAllPlacesByProjectId(projectId: string): Promise<Place[]> {
    const hierarchies = await this._getSortedHierarchiesByProjectId(projectId, 'place');

    const promises = hierarchies.map(async (hierarchy) => {
      return await this.placeStoreService.getPlaceByHierarchy(hierarchy);
    });

    return await Promise.all(promises);
  }

  /**
   * Get character by character relation by relation id
   * @param id relation id
   */
  async getCharacterByCharacterRelationById(id: string): Promise<CharacterByCharacterRelation> {
    const relation = await this.characterByCharacterRelationStoreService.getRelationById(id);

    relation.from = await this.characterStoreService.getCharacterById(relation.fromCharacterId);
    relation.to = await this.characterStoreService.getCharacterById(relation.toCharacterId);

    return relation;
  }

  /**
   * Get character by place relation by relation id
   * @param id relation id
   */
  async getCharacterByPlaceRelationById(id: string): Promise<CharacterByPlaceRelation> {
    const relation = await this.characterByPlaceRelationStoreService.getRelationById(id);

    relation.character = await this.characterStoreService.getCharacterById(relation.characterId);
    relation.place = await this.placeStoreService.getPlaceById(relation.placeId);

    return relation;
  }

  /**
   * Get episode by character relation by relation id
   * @param id relation id
   */
  async getEpisodeByCharacterRelationById(id: string): Promise<EpisodeByCharacterRelation> {
    const relation = await this.episodeByCharacterRelationStoreService.getRelationById(id);

    relation.character = await this.characterStoreService.getCharacterById(relation.characterId);
    relation.episode = await this.episodeStoreService.getEpisodeById(relation.episodeId);

    return relation;
  }

  /**
   * Get episode by place relation by relation id
   * @param id relation id
   */
  async getEpisodeByPlaceRelationById(id: string): Promise<EpisodeByPlaceRelation> {
    const relation = await this.episodeByPlaceRelationStoreService.getRelationById(id);

    relation.episode = await this.episodeStoreService.getEpisodeById(relation.episodeId);
    relation.place = await this.placeStoreService.getPlaceById(relation.placeId);

    return relation;
  }

  /**
   * Get character by character relations by from character.
   * @param character from character
   */
  async getCharacterByCharacterRelationsByFromCharacter(character: Character): Promise<CharacterByCharacterRelation[]> {
    const relations = await this.characterByCharacterRelationStoreService.getRelationsByFromCharacter(character);
    const promises = relations.map(async (relation) => {
      relation.from = await this.characterStoreService.getCharacterById(relation.fromCharacterId);
      relation.to = await this.characterStoreService.getCharacterById(relation.toCharacterId);

      return relation;
    });

    return await Promise.all(promises);
  }

  /**
   * Get character by place relations by character.
   * @param character character
   */
  async getCharacterByPlaceRelationsByCharacter(character: Character): Promise<CharacterByPlaceRelation[]> {
    const relations = await this.characterByPlaceRelationStoreService.getRelationsByCharacter(character);
    const promises = relations.map(async (relation) => {
      relation.character = await this.characterStoreService.getCharacterById(relation.characterId);
      relation.place = await this.placeStoreService.getPlaceById(relation.placeId);

      return relation;
    });

    return await Promise.all(promises);
  }

  /**
   * Get character by place relations by place.
   * @param place place
   */
  async getCharacterByPlaceRelationsByPlace(place: Place): Promise<CharacterByPlaceRelation[]> {
    const relations = await this.characterByPlaceRelationStoreService.getRelationsByPlace(place);
    const promises = relations.map(async (relation) => {
      relation.character = await this.characterStoreService.getCharacterById(relation.characterId);
      relation.place = await this.placeStoreService.getPlaceById(relation.placeId);

      return relation;
    });

    return await Promise.all(promises);
  }

  /**
   * Get episode by character relations by episode
   * @param episode episode
   */
  async getEpisodeByCharacterRelationsByEpisode(episode: Episode): Promise<EpisodeByCharacterRelation[]> {
    const relations = await this.episodeByCharacterRelationStoreService.getRelationsByEpisode(episode);
    const promises = relations.map(async (relation) => {
      relation.character = await this.characterStoreService.getCharacterById(relation.characterId);
      relation.episode = await this.episodeStoreService.getEpisodeById(relation.episodeId);

      return relation;
    });

    return await Promise.all(promises);
  }

  /**
   * Get episode by place relations by episode
   * @param episode episode
   */
  async getEpisodeByPlaceRelationsByEpisode(episode: Episode): Promise<EpisodeByPlaceRelation[]> {
    const relations = await this.episodeByPlaceRelationStoreService.getRelationsByEpisode(episode);
    const promises = relations.map(async (relation) => {
      relation.episode = await this.episodeStoreService.getEpisodeById(relation.episodeId);
      relation.place = await this.placeStoreService.getPlaceById(relation.placeId);

      return relation;
    });

    return await Promise.all(promises);
  }

  /**
   * Get episode by character relations by character
   * @param character character
   */
  async getEpisodeByCharacterRelationsByCharacter(character: Character): Promise<EpisodeByCharacterRelation[]> {
    const relations = await this.episodeByCharacterRelationStoreService.getRelationsByCharacter(character);
    const promises = relations.map(async (relation) => {
      relation.character = await this.characterStoreService.getCharacterById(relation.characterId);
      relation.episode = await this.episodeStoreService.getEpisodeById(relation.episodeId);

      return relation;
    });

    return await Promise.all(promises);
  }

  /**
   * Get episode by place relations by place
   * @param place place
   */
  async getEpisodeByPlaceRelationsByPlace(place: Place): Promise<EpisodeByPlaceRelation[]> {
    const relations = await this.episodeByPlaceRelationStoreService.getRelationsByPlace(place);
    const promises = relations.map(async (relation) => {
      relation.episode = await this.episodeStoreService.getEpisodeById(relation.episodeId);
      relation.place = await this.placeStoreService.getPlaceById(relation.placeId);

      return relation;
    });

    return await Promise.all(promises);
  }

  /**
   * Delete relation
   * @param from from type
   * @param to to type
   * @param relation relation
   */
  async deleteRelation(from: string, to: string, relation: AvailableRelation): Promise<void> {
    let delete$: Observable<void>;
    let transaction = this.dbService.db.transaction([
      this.characterByCharacterRelationStoreService.storeName,
      this.characterByPlaceRelationStoreService.storeName,
      this.episodeByCharacterRelationStoreService.storeName,
      this.episodeByPlaceRelationStoreService.storeName,
    ], 'readwrite');

    if (from === 'character' && to === 'character') {
      delete$ = IndexedDbUtil.deleteWithTransaction(transaction, this.characterByCharacterRelationStoreService.storeName, relation.id);
    } else if (from === 'character' && to === 'place') {
      delete$ = IndexedDbUtil.deleteWithTransaction(transaction, this.characterByPlaceRelationStoreService.storeName, relation.id);
    } else if (from === 'episode' && to === 'character') {
      delete$ = IndexedDbUtil.deleteWithTransaction(transaction, this.episodeByCharacterRelationStoreService.storeName, relation.id);
    } else if (from === 'episode' && to === 'place') {
      delete$ = IndexedDbUtil.deleteWithTransaction(transaction, this.episodeByPlaceRelationStoreService.storeName, relation.id);
    } else {
      throw new Error('Invalid relation');
    }

    await lastValueFrom(delete$);
  }

  /**
   * Return name ascending sorted hierarchies by project id
   * @param projectId project id
   * @param type hierarchy type
   */
  private async _getSortedHierarchiesByProjectId(projectId: string, type: HierarchyType): Promise<HierarchyItem[]> {
    const hierarchies = await this.hierarchyStoreService.getAllByProjectIdAndType(projectId, type);
    const sortFunction = SortUtil.sortMethodWithOrderByColumn<HierarchyItem>({
      property: 'name',
      order: 'asc',
      type: 'string',
    });

    hierarchies.sort(sortFunction);

    return hierarchies;
  }
}
