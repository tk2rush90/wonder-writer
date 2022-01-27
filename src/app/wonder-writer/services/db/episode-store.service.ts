import {Injectable} from '@angular/core';
import {HierarchyItem} from '../../models/hierarchy-item';
import {IndexedDbUtil} from '@tk-ui/utils/indexed-db.util';
import {lastValueFrom} from 'rxjs';
import {Episode} from '../../models/episode';
import {EpisodeByCharacterRelationStoreService} from './episode-by-character-relation-store.service';
import {EpisodeByPlaceRelationStoreService} from './episode-by-place-relation-store.service';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {DbService} from '@wonder-writer/services/db/db.service';

@Injectable({
  providedIn: 'root'
})
export class EpisodeStoreService {
  static storeName = 'Episode';

  constructor(
    private dbService: DbService,
    private episodeByCharacterRelationStoreService: EpisodeByCharacterRelationStoreService,
    private episodeByPlaceRelationStoreService: EpisodeByPlaceRelationStoreService,
  ) {
  }

  get storeName(): string {
    return EpisodeStoreService.storeName;
  }

  /**
   * Delete episode with hierarchy
   * @param transaction transaction
   * @param hierarchy hierarchy
   */
  async deleteEpisodeByHierarchy(transaction: IDBTransaction, hierarchy: HierarchyItem): Promise<void> {
    const store = transaction.objectStore(this.storeName);
    const index = store.index('hierarchyId');
    const get$ = IndexedDbUtil.getWithIndex<Episode>(index, hierarchy.id as string);
    const episode = await lastValueFrom(get$);

    await this.episodeByCharacterRelationStoreService.deleteRelationByEpisode(transaction, episode);
    await this.episodeByPlaceRelationStoreService.deleteRelationByEpisode(transaction, episode);

    const delete$ = IndexedDbUtil.deleteWithTransaction(transaction, this.storeName, episode.id as string);

    await lastValueFrom(delete$);
  }

  /**
   * Add episode with hierarchy
   * @param transaction transaction
   * @param hierarchy hierarchy
   */
  async addEpisodeByHierarchy(transaction: IDBTransaction, hierarchy: HierarchyItem): Promise<void> {
    // Create episode model
    const episode: Episode = {
      id: RandomUtil.key(),
      hierarchyId: hierarchy.id as string,
      name: hierarchy.name,
      content: '',
    };

    const add$ = IndexedDbUtil.addWithTransaction(transaction, this.storeName, episode);

    await lastValueFrom(add$);
  }

  /**
   * Update episode by hierarchy
   * @param transaction transaction
   * @param hierarchy hierarchy
   */
  async updateEpisodeByHierarchy(transaction: IDBTransaction, hierarchy: HierarchyItem): Promise<void> {
    const store = transaction.objectStore(this.storeName);
    const index = store.index('hierarchyId');
    const get$ = IndexedDbUtil.getWithIndex<Episode>(index, hierarchy.id as string);
    const episode = await lastValueFrom(get$);

    episode.name = hierarchy.name;

    const update$ = IndexedDbUtil.putWithTransaction(transaction, this.storeName, episode);

    await lastValueFrom(update$);
  }

  /**
   * Get episode by hierarchy
   * @param hierarchy hierarchy
   */
  async getEpisodeByHierarchy(hierarchy: HierarchyItem): Promise<Episode> {
    const transaction = this.dbService.db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const index = store.index('hierarchyId');

    const get$ = IndexedDbUtil.getWithIndex<Episode>(index, hierarchy.id as string);

    return await lastValueFrom(get$);
  }

  /**
   * Update episode
   * @param episode episode
   */
  async updateEpisode(episode: Episode): Promise<void> {
    const result = await this.getEpisodeById(episode.id);
    const update$ = IndexedDbUtil.put<Episode>(this.dbService.db, this.storeName, {
      ...result,
      content: episode.content,
    });

    await lastValueFrom(update$);
  }

  /**
   * Get episode by id
   * @param id id
   */
  async getEpisodeById(id: string): Promise<Episode> {
    const get$ = IndexedDbUtil.get<Episode>(this.dbService.db, this.storeName, id);
    const episode = await lastValueFrom(get$);

    if (episode) {
      return episode;
    } else {
      throw new Error('Episode not found');
    }
  }
}
