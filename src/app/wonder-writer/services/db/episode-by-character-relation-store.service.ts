import {Injectable} from '@angular/core';
import {Character} from '../../models/character';
import {IndexedDbUtil} from '@tk-ui/utils/indexed-db.util';
import {lastValueFrom} from 'rxjs';
import {EpisodeByCharacterRelation} from '../../models/episode-by-character-relation';
import {Episode} from '../../models/episode';
import {DbService} from '@wonder-writer/services/db/db.service';
import {RandomUtil} from '@tk-ui/utils/random.util';

@Injectable({
  providedIn: 'root'
})
export class EpisodeByCharacterRelationStoreService {
  static storeName = 'EpisodeByCharacterRelation';

  constructor(
    private dbService: DbService,
  ) {
  }

  get storeName(): string {
    return EpisodeByCharacterRelationStoreService.storeName;
  }

  /**
   * Delete relation by character.
   * @param transaction transaction
   * @param character character model
   */
  async deleteRelationByCharacter(transaction: IDBTransaction, character: Character): Promise<void> {
    const store = transaction.objectStore(this.storeName);
    const index = store.index('characterId');

    const get$ = IndexedDbUtil.getAllWithIndex<EpisodeByCharacterRelation>(index, character.id as string);
    const relations = await lastValueFrom(get$);
    const promises = relations.map(async (relation) => {
      const delete$ = IndexedDbUtil.deleteWithTransaction(transaction, this.storeName, relation.id as string);

      await lastValueFrom(delete$);
    });

    await Promise.all(promises);
  }

  /**
   * Delete relation by episode.
   * @param transaction transaction
   * @param episode episode model
   */
  async deleteRelationByEpisode(transaction: IDBTransaction, episode: Episode): Promise<void> {
    const store = transaction.objectStore(this.storeName);
    const index = store.index('episodeId');

    const get$ = IndexedDbUtil.getAllWithIndex<EpisodeByCharacterRelation>(index, episode.id as string);
    const relations = await lastValueFrom(get$);
    const promises = relations.map(async (relation) => {
      const delete$ = IndexedDbUtil.deleteWithTransaction(transaction, this.storeName, relation.id as string);

      await lastValueFrom(delete$);
    });

    await Promise.all(promises);
  }

  /**
   * Return relation by id
   * @param id id
   */
  async getRelationById(id: string): Promise<EpisodeByCharacterRelation> {
    const get$ = IndexedDbUtil.get<EpisodeByCharacterRelation>(this.dbService.db, this.storeName, id);
    const relation = await lastValueFrom(get$);

    if (relation) {
      return relation;
    } else {
      throw new Error('Episode-by-character relation not found');
    }
  }

  /**
   * Get relations by character
   * @param character character
   */
  async getRelationsByCharacter(character: Character): Promise<EpisodeByCharacterRelation[]> {
    return await this._getRelationsByIndex('characterId', character.id as string);
  }

  /**
   * Get relations by episode
   * @param episode episode
   */
  async getRelationsByEpisode(episode: Episode): Promise<EpisodeByCharacterRelation[]> {
    return await this._getRelationsByIndex('episodeId', episode.id as string);
  }

  /**
   * Add relation
   * @param episode episode
   * @param character character
   * @param relation relation
   * @param memo memo
   */
  async addRelation(episode: Episode, character: Character, relation: string, memo: string): Promise<EpisodeByCharacterRelation> {
    const model: EpisodeByCharacterRelation = {
      id: RandomUtil.key(),
      relation,
      memo,
      episodeId: episode.id,
      characterId: character.id,
    };

    const add$ = IndexedDbUtil.add<EpisodeByCharacterRelation>(this.dbService.db, this.storeName, model);

    await lastValueFrom(add$);

    return model;
  }

  /**
   * Update relation
   * @param model existing model
   * @param episode episode
   * @param character character
   * @param relation relation
   * @param memo memo
   */
  async updateRelation(model: EpisodeByCharacterRelation, episode: Episode, character: Character, relation: string, memo: string): Promise<EpisodeByCharacterRelation> {
    const _model: EpisodeByCharacterRelation = {
      ...model,
      relation,
      memo,
      episodeId: episode.id,
      characterId: character.id,
    };

    delete _model.episode;
    delete _model.character;

    const add$ = IndexedDbUtil.put<EpisodeByCharacterRelation>(this.dbService.db, this.storeName, _model);

    await lastValueFrom(add$);

    return _model;
  }

  /**
   * Get relations by index
   * @param name index name
   * @param query query
   */
  private async _getRelationsByIndex(name: string, query: IDBValidKey | IDBKeyRange | null = null): Promise<EpisodeByCharacterRelation[]> {
    const transaction = this.dbService.db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const index = store.index(name);

    const getAll$ = IndexedDbUtil.getAllWithIndex<EpisodeByCharacterRelation>(index, query);

    return await lastValueFrom(getAll$);
  }
}
