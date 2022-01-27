import {Injectable} from '@angular/core';
import {HierarchyItem} from '../../models/hierarchy-item';
import {IndexedDbUtil} from '@tk-ui/utils/indexed-db.util';
import {lastValueFrom} from 'rxjs';
import {Manuscript} from '../../models/manuscript';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {DbService} from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ManuscriptStoreService {
  static storeName = 'Manuscript';

  constructor(
    private dbService: DbService,
  ) {
  }

  get storeName(): string {
    return ManuscriptStoreService.storeName;
  }

  /**
   * Delete manuscript with hierarchy
   * @param transaction transaction
   * @param hierarchy hierarchy
   */
  async deleteManuscriptByHierarchy(transaction: IDBTransaction, hierarchy: HierarchyItem): Promise<void> {
    const store = transaction.objectStore(this.storeName);
    const index = store.index('hierarchyId');
    const get$ = IndexedDbUtil.getWithIndex<Manuscript>(index, hierarchy.id as string);
    const manuscript = await lastValueFrom(get$);
    const delete$ = IndexedDbUtil.deleteWithTransaction(transaction, this.storeName, manuscript.id as string);

    await lastValueFrom(delete$);
  }

  /**
   * Add manuscript by hierarchy
   * @param transaction transaction
   * @param hierarchy hierarchy
   */
  async addManuscriptByHierarchy(transaction: IDBTransaction, hierarchy: HierarchyItem): Promise<void> {
    // Create manuscript model
    const manuscript: Manuscript = {
      id: RandomUtil.key(),
      hierarchyId: hierarchy.id as string,
      name: hierarchy.name,
    };

    const add$ = IndexedDbUtil.addWithTransaction(transaction, this.storeName, manuscript);

    await lastValueFrom(add$);
  }

  /**
   * Update manuscript by hierarchy
   * Use when hierarchy name is changed
   * @param transaction transaction
   * @param hierarchy hierarchy
   */
  async updateManuscriptByHierarchy(transaction: IDBTransaction, hierarchy: HierarchyItem): Promise<void> {
    const store = transaction.objectStore(this.storeName);
    const index = store.index('hierarchyId');
    const get$ = IndexedDbUtil.getWithIndex<Manuscript>(index, hierarchy.id as string);
    const manuscript = await lastValueFrom(get$);

    manuscript.name = hierarchy.name;

    const update$ = IndexedDbUtil.putWithTransaction(transaction, this.storeName, manuscript);

    await lastValueFrom(update$);
  }

  /**
   * Get manuscript by hierarchy
   * @param hierarchy hierarchy
   */
  async getManuscriptByHierarchy(hierarchy: HierarchyItem): Promise<Manuscript> {
    const transaction = this.dbService.db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const index = store.index('hierarchyId');

    const get$ = IndexedDbUtil.getWithIndex<Manuscript>(index, hierarchy.id as string);

    return await lastValueFrom(get$);
  }

  /**
   * Update manuscript after contents changed
   * @param manuscript manuscript
   */
  async updateManuscript(manuscript: Manuscript): Promise<void> {
    const transaction = this.dbService.db.transaction(this.storeName, 'readwrite');

    const get$ = IndexedDbUtil.getWithTransaction<Manuscript>(transaction, this.storeName, manuscript.id);

    const result = await lastValueFrom(get$);

    if (result) {
      const update$ = IndexedDbUtil.put<Manuscript>(this.dbService.db, this.storeName, {
        ...result,
        content: manuscript.content,
      });

      await lastValueFrom(update$);
    } else {
      throw new Error('Manuscript not found');
    }
  }
}
