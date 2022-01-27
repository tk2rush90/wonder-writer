import {Injectable} from '@angular/core';
import {ProjectItem} from '../../models/project-item';
import {IndexedDbUtil} from '@tk-ui/utils/indexed-db.util';
import {HierarchyItem, HierarchyType} from '../../models/hierarchy-item';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {lastValueFrom, Observable} from 'rxjs';
import {DbService} from './db.service';
import {ManuscriptStoreService} from './manuscript-store.service';
import {CharacterStoreService} from './character-store.service';
import {PlaceStoreService} from './place-store.service';
import {EpisodeStoreService} from './episode-store.service';
import {SortUtil} from '@tk-ui/utils/sort.util';

@Injectable({
  providedIn: 'root'
})
export class HierarchyStoreService {
  static storeName = 'Hierarchy';

  constructor(
    private dbService: DbService,
    private manuscriptStoreService: ManuscriptStoreService,
    private characterStoreService: CharacterStoreService,
    private placeStoreService: PlaceStoreService,
    private episodeStoreService: EpisodeStoreService,
  ) {
  }

  get storeName(): string {
    return HierarchyStoreService.storeName;
  }

  /**
   * Initialize project hierarchies
   * @param transaction transaction
   * @param project project to create
   */
  async initProjectHierarchies(transaction: IDBTransaction, project: ProjectItem): Promise<void> {
    const projectId = project.id as string;

    // Initial hierarchies.
    // Set parent id as empty string to make to be indexed by db.
    const hierarchies: HierarchyItem[] = [
      {
        id: RandomUtil.key(),
        name: '원고',
        type: 'directory',
        projectId,
        parentId: '',
        directoryType: 'manuscript',
        order: 0,
      },
      {
        id: RandomUtil.key(),
        name: '인물',
        type: 'directory',
        projectId,
        parentId: '',
        directoryType: 'character',
        order: 1,
      },
      {
        id: RandomUtil.key(),
        name: '장소',
        type: 'directory',
        projectId,
        parentId: '',
        directoryType: 'place',
        order: 2,
      },
      {
        id: RandomUtil.key(),
        name: '사건',
        type: 'directory',
        projectId,
        parentId: '',
        directoryType: 'episode',
        order: 3,
      },
    ];

    const addHierarchies$ = IndexedDbUtil.addWithTransaction(transaction, this.storeName, hierarchies);

    await lastValueFrom(addHierarchies$);
  }

  /**
   * Delete all hierarchies in project
   * @param transaction transaction
   * @param project project
   */
  async deleteProjectHierarchies(transaction: IDBTransaction, project: ProjectItem): Promise<void> {
    const index = transaction.objectStore(this.storeName).index('projectId');
    const getAll$ = IndexedDbUtil.getAllWithIndex<HierarchyItem>(index, project.id as string);
    const results = await lastValueFrom(getAll$);
    const promises = results.map(async (result) => {
      // Switch by hierarchy type.
      // Since this process is deleting all hierarchies in project, no need to handle directory type.
      switch (result.type) {
        case 'manuscript': {
          await this.manuscriptStoreService.deleteManuscriptByHierarchy(transaction, result);
          break;
        }

        case 'character': {
          await this.characterStoreService.deleteCharacterByHierarchy(transaction, result);
          break;
        }

        case 'place': {
          await this.placeStoreService.deletePlaceByHierarchy(transaction, result);
          break;
        }

        case 'episode': {
          await this.episodeStoreService.deleteEpisodeByHierarchy(transaction, result);
          break;
        }
      }

      const delete$ = IndexedDbUtil.deleteWithTransaction(transaction, this.storeName, result.id as string);

      await lastValueFrom(delete$);
    });

    await Promise.all(promises);
  }

  /**
   * Get hierarchy by id
   * @param id id
   */
  async getHierarchyById(id: string): Promise<HierarchyItem> {
    const get$ = IndexedDbUtil.get<HierarchyItem>(this.dbService.db, this.storeName, id);
    const hierarchy = await lastValueFrom(get$);

    if (hierarchy) {
      return hierarchy;
    } else {
      throw new Error('Hierarchy not found');
    }
  }

  /**
   * Get all hierarchies in project by project id.
   * @param projectId project id
   */
  async getAllByProjectId(projectId: string): Promise<HierarchyItem[]> {
    const transaction = this.dbService.db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const index = store.index('projectId, parentId');

    // Get root hierarchies
    const getAll$ = IndexedDbUtil.getAllWithIndex<HierarchyItem>(index, [projectId, '']);

    return await this._handleGetAllObservable(store, getAll$);
  }

  /**
   * Get all hierarchies which has specific type in project by project id
   * @param projectId project id
   * @param type type
   */
  async getAllByProjectIdAndType(projectId: string, type: HierarchyType): Promise<HierarchyItem[]> {
    const transaction = this.dbService.db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const index = store.index('projectId, type');

    // Get root hierarchies
    const getAll$ = IndexedDbUtil.getAllWithIndex<HierarchyItem>(index, [projectId, type]);

    return await this._handleGetAllObservable(store, getAll$);
  }

  /**
   * Add directory hierarchy.
   * @param name hierarchy name
   * @param parent parent hierarchy
   */
  async addDirectoryHierarchy(name: string, parent: HierarchyItem): Promise<HierarchyItem> {
    const hierarchy: HierarchyItem = {
      name,
      // Set id and type.
      id: RandomUtil.key(),
      type: 'directory',
      // Sdd directory order.
      order: parent.children!.length,
      // Inherit parent info.
      parentId: parent.id,
      projectId: parent.projectId,
      directoryType: parent.directoryType,
    };

    const add$ = IndexedDbUtil.add(this.dbService.db, this.storeName, hierarchy);

    await lastValueFrom(add$);

    // Initialize children
    hierarchy.children = [];

    return hierarchy;
  }

  /**
   * Delete directory hierarchy.
   * @param hierarchy hierarchy
   */
  async deleteDirectoryHierarchy(hierarchy: HierarchyItem): Promise<void> {
    const transaction = this.dbService.db.transaction(this.storeName, 'readwrite');

    await this._deleteDirectoryWithChildren(transaction, hierarchy);
  }

  /**
   * Add new article hierarchy.
   * @param name name
   * @param type type
   * @param parent parent
   */
  async addHierarchy(name: string, type: HierarchyType, parent: HierarchyItem): Promise<HierarchyItem> {
    const transaction = this.dbService.db.transaction(this.dbService.db.objectStoreNames as any, 'readwrite');

    try {
      const hierarchy: HierarchyItem = {
        name,
        type,
        // Set id and type.
        id: RandomUtil.key(),
        // Sdd directory order.
        order: parent.children!.length,
        // Inherit parent info.
        parentId: parent.id,
        projectId: parent.projectId,
      };

      const add$ = IndexedDbUtil.addWithTransaction(transaction, this.storeName, hierarchy);

      await lastValueFrom(add$);

      // Create document model
      switch (type) {
        case 'manuscript': {
          await this.manuscriptStoreService.addManuscriptByHierarchy(transaction, hierarchy);
          break;
        }

        case 'character': {
          await this.characterStoreService.addCharacterByHierarchy(transaction, hierarchy);
          break;
        }

        case 'place': {
          await this.placeStoreService.addPlaceByHierarchy(transaction, hierarchy);
          break;
        }

        case 'episode': {
          await this.episodeStoreService.addEpisodeByHierarchy(transaction, hierarchy);
          break;
        }
      }

      return hierarchy;
    } catch (e) {
      transaction.abort();

      throw e;
    }
  }

  /**
   * Delete article hierarchy.
   * @param hierarchy hierarchy
   */
  async deleteHierarchy(hierarchy: HierarchyItem): Promise<void> {
    const transaction = this.dbService.db.transaction(this.dbService.db.objectStoreNames as any, 'readwrite');

    try {
      await this._deleteHierarchyWithTransaction(transaction, hierarchy);
    } catch (e) {
      transaction.abort();

      throw e;
    }
  }

  /**
   * Update hierarchy.
   * @param hierarchy hierarchy
   */
  async updateHierarchy(hierarchy: HierarchyItem): Promise<HierarchyItem> {
    const transaction = this.dbService.db.transaction(this.dbService.db.objectStoreNames as any, 'readwrite');

    try {
      // Delete document model
      switch (hierarchy.type) {
        case 'manuscript': {
          await this.manuscriptStoreService.updateManuscriptByHierarchy(transaction, hierarchy);
          break;
        }

        case 'character': {
          await this.characterStoreService.updateCharacterByHierarchy(transaction, hierarchy);
          break;
        }

        case 'place': {
          await this.placeStoreService.updatePlaceByHierarchy(transaction, hierarchy);
          break;
        }

        case 'episode': {
          await this.episodeStoreService.updateEpisodeByHierarchy(transaction, hierarchy);
          break;
        }
      }

      // Delete unnecessary properties.
      delete hierarchy.opened;
      delete hierarchy.children;

      const update$ = IndexedDbUtil.put(this.dbService.db, this.storeName, hierarchy);

      await lastValueFrom(update$);

      return hierarchy;
    } catch (e) {
      transaction.abort();

      throw e;
    }
  }

  /**
   * Update repositioned origin/target hierarchies
   * @param origin origin hierarchy should be directory type
   * @param target target hierarchy should be directory type
   */
  async updateRepositionedHierarchies(origin?: HierarchyItem, target?: HierarchyItem): Promise<void> {
    const transaction = this.dbService.db.transaction([this.storeName], 'readwrite');

    try {
      if (origin) {
        await this._updateRepositionedHierarchy(transaction, origin);
      }

      if (target) {
        await this._updateRepositionedHierarchy(transaction, target);
      }
    } catch (e) {
      transaction.abort();

      throw e;
    }
  }

  /**
   * Clear hierarchy children
   * @param hierarchy hierarchy
   */
  async clearHierarchy(hierarchy: HierarchyItem): Promise<void> {
    const transaction = this.dbService.db.transaction(this.dbService.db.objectStoreNames as any, 'readwrite');

    try {
      const promises = (hierarchy.children || []).map(async (item) => {
        await this._deleteHierarchyWithTransaction(transaction, item);
      });

      await Promise.all(promises);
    } catch (e) {
      transaction.abort();

      throw e;
    }
  }

  /**
   * Get hierarchies by parent id.
   * Returns children hierarchies as well.
   * @param store store
   * @param parentId parent id
   */
  private async _getAllByParentIdWithChildren(store: IDBObjectStore, parentId: string): Promise<HierarchyItem[]> {
    const index = store.index('parentId');
    const getAll$ = IndexedDbUtil.getAllWithIndex<HierarchyItem>(index, parentId);

    return await this._handleGetAllObservable(store, getAll$);
  }

  /**
   * Handle get all hierarchies observable to get children.
   * @param store store
   * @param observable$ observable stream
   */
  private async _handleGetAllObservable(store: IDBObjectStore, observable$: Observable<HierarchyItem[]>): Promise<HierarchyItem[]> {
    const hierarchies = await lastValueFrom(observable$);

    // Sort hierarchies by order
    const sortFunction = SortUtil.sortMethodWithOrderByColumn<HierarchyItem>({
      property: 'order',
      type: 'number',
      order: 'asc',
    });

    hierarchies.sort(sortFunction);

    // Get child hierarchies
    const promises = hierarchies.map(async (hierarchy) => {
      if (hierarchy.type === 'directory') {
        hierarchy.children = await this._getAllByParentIdWithChildren(store, hierarchy.id as string);
      }

      return Promise.resolve(hierarchy);
    });

    return Promise.all(promises);
  }

  /**
   * Delete directory with children.
   * @param transaction transaction
   * @param hierarchy hierarchy
   */
  private async _deleteDirectoryWithChildren(transaction: IDBTransaction, hierarchy: HierarchyItem): Promise<void> {
    // If directory type, delete children first.
    if (hierarchy.type === 'directory') {
      const promises = hierarchy.children!.map(async (item) => {
        await this._deleteDirectoryWithChildren(transaction, item);
      });

      await Promise.all(promises);
    }

    // Then, delete hierarchy
    await IndexedDbUtil.deleteWithTransaction(transaction, this.storeName, hierarchy.id as string);
  }

  /**
   * Delete hierarchy with transaction
   * @param transaction transaction
   * @param hierarchy hierarchy
   */
  private async _deleteHierarchyWithTransaction(transaction: IDBTransaction, hierarchy: HierarchyItem): Promise<void> {
    // Delete document model
    switch (hierarchy.type) {
      case 'manuscript': {
        await this.manuscriptStoreService.deleteManuscriptByHierarchy(transaction, hierarchy);
        break;
      }

      case 'character': {
        await this.characterStoreService.deleteCharacterByHierarchy(transaction, hierarchy);
        break;
      }

      case 'place': {
        await this.placeStoreService.deletePlaceByHierarchy(transaction, hierarchy);
        break;
      }

      case 'episode': {
        await this.episodeStoreService.deleteEpisodeByHierarchy(transaction, hierarchy);
        break;
      }
    }

    const delete$ = IndexedDbUtil.delete(this.dbService.db, this.storeName, hierarchy.id as string);

    await lastValueFrom(delete$);
  }

  /**
   * Update repositioned hierarchy and children
   * @param transaction transaction
   * @param hierarchy directory hierarchy
   */
  private async _updateRepositionedHierarchy(transaction: IDBTransaction, hierarchy: HierarchyItem): Promise<void> {
    const promises = (hierarchy.children || []).map(async (child) => {
      await this._updateHierarchyDetail(transaction, child);
    });

    await Promise.all(promises);
    await this._updateHierarchyDetail(transaction, hierarchy);
  }

  /**
   * Update hierarchy details for repositioned item.
   * @param transaction transaction
   * @param hierarchy hierarchy
   */
  private async _updateHierarchyDetail(transaction: IDBTransaction, hierarchy: HierarchyItem): Promise<void> {
    // Clone hierarchy
    const _hierarchy = {
      ...hierarchy,
    };

    // Delete unnecessary properties
    delete _hierarchy.opened;
    delete _hierarchy.children;

    const update$ = IndexedDbUtil.putWithTransaction(transaction, this.storeName, _hierarchy);

    await lastValueFrom(update$);
  }
}
