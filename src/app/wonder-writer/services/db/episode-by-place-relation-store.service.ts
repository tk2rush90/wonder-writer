import {Injectable} from '@angular/core';
import {IndexedDbUtil} from '@tk-ui/utils/indexed-db.util';
import {lastValueFrom} from 'rxjs';
import {Place} from '../../models/place';
import {EpisodeByPlaceRelation} from '../../models/episode-by-place-relation';
import {Episode} from '../../models/episode';
import {DbService} from '@wonder-writer/services/db/db.service';
import {RandomUtil} from '@tk-ui/utils/random.util';

@Injectable({
  providedIn: 'root'
})
export class EpisodeByPlaceRelationStoreService {
  static storeName = 'EpisodeByPlaceRelation';

  constructor(
    private dbService: DbService,
  ) {
  }

  get storeName(): string {
    return EpisodeByPlaceRelationStoreService.storeName;
  }

  /**
   * Delete relation by place.
   * @param transaction transaction
   * @param place place model
   */
  async deleteRelationByPlace(transaction: IDBTransaction, place: Place): Promise<void> {
    const store = transaction.objectStore(this.storeName);
    const index = store.index('placeId');

    const get$ = IndexedDbUtil.getAllWithIndex<EpisodeByPlaceRelation>(index, place.id as string);
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

    const get$ = IndexedDbUtil.getAllWithIndex<EpisodeByPlaceRelation>(index, episode.id as string);
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
  async getRelationById(id: string): Promise<EpisodeByPlaceRelation> {
    const get$ = IndexedDbUtil.get<EpisodeByPlaceRelation>(this.dbService.db, this.storeName, id);
    const relation = await lastValueFrom(get$);

    if (relation) {
      return relation;
    } else {
      throw new Error('Episode-by-place relation not found');
    }
  }

  /**
   * Get relations by place
   * @param place place
   */
  async getRelationsByPlace(place: Place): Promise<EpisodeByPlaceRelation[]> {
    return await this._getRelationsByIndex('placeId', place.id as string);
  }

  /**
   * Get relations by episode
   * @param episode episode
   */
  async getRelationsByEpisode(episode: Episode): Promise<EpisodeByPlaceRelation[]> {
    return await this._getRelationsByIndex('episodeId', episode.id as string);
  }

  /**
   * Add relation
   * @param episode episode
   * @param place character
   * @param relation relation
   * @param memo memo
   */
  async addRelation(episode: Episode, place: Place, relation: string, memo: string): Promise<EpisodeByPlaceRelation> {
    const model: EpisodeByPlaceRelation = {
      id: RandomUtil.key(),
      relation,
      memo,
      episodeId: episode.id,
      placeId: place.id,
    };

    const add$ = IndexedDbUtil.add<EpisodeByPlaceRelation>(this.dbService.db, this.storeName, model);

    await lastValueFrom(add$);

    return model;
  }

  /**
   * Update relation
   * @param model existing model
   * @param episode episode
   * @param place character
   * @param relation relation
   * @param memo memo
   */
  async updateRelation(model: EpisodeByPlaceRelation, episode: Episode, place: Place, relation: string, memo: string): Promise<EpisodeByPlaceRelation> {
    const _model: EpisodeByPlaceRelation = {
      ...model,
      relation,
      memo,
      episodeId: episode.id,
      placeId: place.id,
    };

    delete _model.episode;
    delete _model.place;

    const add$ = IndexedDbUtil.put<EpisodeByPlaceRelation>(this.dbService.db, this.storeName, _model);

    await lastValueFrom(add$);

    return _model;
  }

  /**
   * Get relations by index
   * @param name index name
   * @param query query
   */
  private async _getRelationsByIndex(name: string, query: IDBValidKey | IDBKeyRange | null = null): Promise<EpisodeByPlaceRelation[]> {
    const transaction = this.dbService.db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const index = store.index(name);

    const getAll$ = IndexedDbUtil.getAllWithIndex<EpisodeByPlaceRelation>(index, query);

    return await lastValueFrom(getAll$);
  }
}
