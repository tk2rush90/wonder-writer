import {Injectable} from '@angular/core';
import {HierarchyItem} from '../../models/hierarchy-item';
import {IndexedDbUtil} from '@tk-ui/utils/indexed-db.util';
import {lastValueFrom} from 'rxjs';
import {Character} from '../../models/character';
import {CharacterByCharacterRelationStoreService} from './character-by-character-relation-store.service';
import {CharacterByPlaceRelationStoreService} from './character-by-place-relation-store.service';
import {EpisodeByCharacterRelationStoreService} from './episode-by-character-relation-store.service';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {DbService} from './db.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterStoreService {
  static storeName = 'Character';

  constructor(
    private dbService: DbService,
    private characterByCharacterRelationStoreService: CharacterByCharacterRelationStoreService,
    private characterByPlaceRelationStoreService: CharacterByPlaceRelationStoreService,
    private episodeByCharacterRelationStoreService: EpisodeByCharacterRelationStoreService,
  ) {
  }

  get storeName(): string {
    return CharacterStoreService.storeName;
  }

  /**
   * Delete character by hierarchy
   * @param transaction transaction
   * @param hierarchy hierarchy
   */
  async deleteCharacterByHierarchy(transaction: IDBTransaction, hierarchy: HierarchyItem): Promise<void> {
    const store = transaction.objectStore(this.storeName);
    const index = store.index('hierarchyId');
    const get$ = IndexedDbUtil.getWithIndex<Character>(index, hierarchy.id as string);
    const character = await lastValueFrom(get$);

    await this.characterByCharacterRelationStoreService.deleteRelationByCharacter(transaction, character, 'fromCharacterId');
    await this.characterByCharacterRelationStoreService.deleteRelationByCharacter(transaction, character, 'toCharacterId');
    await this.characterByPlaceRelationStoreService.deleteRelationByCharacter(transaction, character);
    await this.episodeByCharacterRelationStoreService.deleteRelationByCharacter(transaction, character);

    const delete$ = IndexedDbUtil.deleteWithTransaction(transaction, this.storeName, character.id as string);

    await lastValueFrom(delete$);
  }

  /**
   * Add character by hierarchy
   * @param transaction transaction
   * @param hierarchy hierarchy
   */
  async addCharacterByHierarchy(transaction: IDBTransaction, hierarchy: HierarchyItem): Promise<void> {
    // Create character model
    const character: Character = {
      id: RandomUtil.key(),
      hierarchyId: hierarchy.id as string,
      name: hierarchy.name,
      content: '',
    };

    const add$ = IndexedDbUtil.addWithTransaction(transaction, this.storeName, character);

    await lastValueFrom(add$);
  }

  /**
   * Update character by hierarchy
   * Use when hierarchy name is changed
   * @param transaction transaction
   * @param hierarchy hierarchy
   */
  async updateCharacterByHierarchy(transaction: IDBTransaction, hierarchy: HierarchyItem): Promise<void> {
    const store = transaction.objectStore(this.storeName);
    const index = store.index('hierarchyId');
    const get$ = IndexedDbUtil.getWithIndex<Character>(index, hierarchy.id as string);
    const character = await lastValueFrom(get$);

    character.name = hierarchy.name;

    const update$ = IndexedDbUtil.putWithTransaction(transaction, this.storeName, character);

    await lastValueFrom(update$);
  }

  /**
   * Get character by hierarchy without relation
   * @param hierarchy hierarchy
   */
  async getCharacterByHierarchy(hierarchy: HierarchyItem): Promise<Character> {
    const transaction = this.dbService.db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const index = store.index('hierarchyId');

    const get$ = IndexedDbUtil.getWithIndex<Character>(index, hierarchy.id as string);

    return await lastValueFrom(get$);
  }

  /**
   * Update character
   * @param character character
   */
  async updateCharacter(character: Character): Promise<void> {
    const result = await this.getCharacterById(character.id);
    const update$ = IndexedDbUtil.put<Character>(this.dbService.db, this.storeName, {
      ...result,
      content: character.content,
    });

    await lastValueFrom(update$);
  }

  /**
   * Get character by character id
   * @param id id
   */
  async getCharacterById(id: string): Promise<Character> {
    const get$ = IndexedDbUtil.get<Character>(this.dbService.db, this.storeName, id);
    const character = await lastValueFrom(get$);

    if (character) {
      return character;
    } else {
      throw new Error('Character not found');
    }
  }
}
