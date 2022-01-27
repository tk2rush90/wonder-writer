import {Injectable} from '@angular/core';
import {HierarchyItem} from '../../models/hierarchy-item';
import {IndexedDbUtil} from '@tk-ui/utils/indexed-db.util';
import {lastValueFrom} from 'rxjs';
import {Place} from '../../models/place';
import {CharacterByPlaceRelationStoreService} from './character-by-place-relation-store.service';
import {EpisodeByPlaceRelationStoreService} from './episode-by-place-relation-store.service';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {DbService} from '@wonder-writer/services/db/db.service';

@Injectable({
  providedIn: 'root'
})
export class PlaceStoreService {
  static storeName = 'Place';

  constructor(
    private dbService: DbService,
    private characterByPlaceRelationStoreService: CharacterByPlaceRelationStoreService,
    private episodeByPlaceRelationStoreService: EpisodeByPlaceRelationStoreService,
  ) {
  }

  get storeName(): string {
    return PlaceStoreService.storeName;
  }

  /**
   * Delete place with hierarchy
   * @param transaction transaction
   * @param hierarchy hierarchy
   */
  async deletePlaceByHierarchy(transaction: IDBTransaction, hierarchy: HierarchyItem): Promise<void> {
    const store = transaction.objectStore(this.storeName);
    const index = store.index('hierarchyId');
    const get$ = IndexedDbUtil.getWithIndex<Place>(index, hierarchy.id as string);
    const place = await lastValueFrom(get$);

    await this.characterByPlaceRelationStoreService.deleteRelationByPlace(transaction, place);
    await this.episodeByPlaceRelationStoreService.deleteRelationByPlace(transaction, place);

    const delete$ = IndexedDbUtil.deleteWithTransaction(transaction, this.storeName, place.id as string);

    await lastValueFrom(delete$);
  }

  /**
   * Add place with hierarchy
   * @param transaction transaction
   * @param hierarchy hierarchy
   */
  async addPlaceByHierarchy(transaction: IDBTransaction, hierarchy: HierarchyItem): Promise<void> {
    // Create place model
    const place: Place = {
      id: RandomUtil.key(),
      hierarchyId: hierarchy.id as string,
      name: hierarchy.name,
      content: '',
    };

    const add$ = IndexedDbUtil.addWithTransaction(transaction, this.storeName, place);

    await lastValueFrom(add$);
  }

  /**
   * Update place by hierarchy
   * Use when hierarchy name is changed
   * @param transaction transaction
   * @param hierarchy hierarchy
   */
  async updatePlaceByHierarchy(transaction: IDBTransaction, hierarchy: HierarchyItem): Promise<void> {
    const store = transaction.objectStore(this.storeName);
    const index = store.index('hierarchyId');
    const get$ = IndexedDbUtil.getWithIndex<Place>(index, hierarchy.id as string);
    const place = await lastValueFrom(get$);

    place.name = hierarchy.name;

    const update$ = IndexedDbUtil.putWithTransaction(transaction, this.storeName, place);

    await lastValueFrom(update$);
  }

  /**
   * Get place by hierarchy
   * @param hierarchy hierarchy
   */
  async getPlaceByHierarchy(hierarchy: HierarchyItem): Promise<Place> {
    const transaction = this.dbService.db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const index = store.index('hierarchyId');

    const get$ = IndexedDbUtil.getWithIndex<Place>(index, hierarchy.id as string);

    return await lastValueFrom(get$);
  }

  /**
   * Update place
   * @param place place
   */
  async updatePlace(place: Place): Promise<void> {
    const result = await this.getPlaceById(place.id);
    const update$ = IndexedDbUtil.put<Place>(this.dbService.db, this.storeName, {
      ...result,
      content: place.content,
    });

    await lastValueFrom(update$);
  }

  /**
   * Get place by id
   * @param id id
   */
  async getPlaceById(id: string): Promise<Place> {
    const get$ = IndexedDbUtil.get<Place>(this.dbService.db, this.storeName, id);
    const place = await lastValueFrom(get$);

    if (place) {
      return place;
    } else {
      throw new Error('Place not found');
    }
  }
}
