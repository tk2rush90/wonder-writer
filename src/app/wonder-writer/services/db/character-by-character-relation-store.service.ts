import {Injectable} from '@angular/core';
import {Character} from '../../models/character';
import {IndexedDbUtil} from '@tk-ui/utils/indexed-db.util';
import {lastValueFrom} from 'rxjs';
import {CharacterByCharacterRelation} from '../../models/character-by-character-relation';
import {DbService} from '@wonder-writer/services/db/db.service';
import {RandomUtil} from '@tk-ui/utils/random.util';

@Injectable({
  providedIn: 'root'
})
export class CharacterByCharacterRelationStoreService {
  static storeName = 'CharacterByCharacterRelation';

  constructor(
    private dbService: DbService,
  ) {
  }

  get storeName(): string {
    return CharacterByCharacterRelationStoreService.storeName;
  }

  /**
   * Delete relation by character.
   * There is 2 character id fields in character-by-character-relation.
   * So, receive the `key` name from the caller.
   * @param transaction transaction
   * @param character character model
   * @param key index key name
   */
  async deleteRelationByCharacter(transaction: IDBTransaction, character: Character, key: string): Promise<void> {
    const store = transaction.objectStore(this.storeName);
    const index = store.index(key);

    const get$ = IndexedDbUtil.getAllWithIndex<CharacterByCharacterRelation>(index, character.id as string);
    const relations = await lastValueFrom(get$);
    const promises = relations.map(async (relation) => {
      const delete$ = IndexedDbUtil.deleteWithTransaction(transaction, this.storeName, relation.id as string);

      await lastValueFrom(delete$);
    });

    await Promise.all(promises);
  }

  /**
   * Return relations by `fromCharacter`
   * @param character character
   */
  async getRelationsByFromCharacter(character: Character): Promise<CharacterByCharacterRelation[]> {
    return await this._getRelationsByIndex('fromCharacterId', character.id as string);
  }

  /**
   * Return relation by id
   * @param id id
   */
  async getRelationById(id: string): Promise<CharacterByCharacterRelation> {
    const get$ = IndexedDbUtil.get<CharacterByCharacterRelation>(this.dbService.db, this.storeName, id);
    const relation = await lastValueFrom(get$);

    if (relation) {
      return relation;
    } else {
      throw new Error('Character-by-character relation not found');
    }
  }

  /**
   * Add relation
   * @param from from character
   * @param to to character
   * @param relation relation
   * @param memo memo
   */
  async addRelation(from: Character, to: Character, relation: string, memo: string): Promise<CharacterByCharacterRelation> {
    const model: CharacterByCharacterRelation = {
      id: RandomUtil.key(),
      relation,
      memo,
      fromCharacterId: from.id,
      toCharacterId: to.id,
    };

    const add$ = IndexedDbUtil.add<CharacterByCharacterRelation>(this.dbService.db, this.storeName, model);

    await lastValueFrom(add$);

    return model;
  }

  /**
   * Update relation
   * @param model existing relation model
   * @param from from character
   * @param to to character
   * @param relation relation
   * @param memo memo
   */
  async updateRelation(model: CharacterByCharacterRelation, from: Character, to: Character, relation: string, memo: string): Promise<CharacterByCharacterRelation> {
    const _model: CharacterByCharacterRelation = {
      ...model,
      relation,
      memo,
      fromCharacterId: from.id,
      toCharacterId: to.id,
    };

    delete _model.from;
    delete _model.to;

    const add$ = IndexedDbUtil.put<CharacterByCharacterRelation>(this.dbService.db, this.storeName, _model);

    await lastValueFrom(add$);

    return _model;
  }

  /**
   * Get relations by index
   * @param name index name
   * @param query query
   */
  private async _getRelationsByIndex(name: string, query: IDBValidKey | IDBKeyRange | null = null): Promise<CharacterByCharacterRelation[]> {
    const transaction = this.dbService.db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const index = store.index(name);

    const getAll$ = IndexedDbUtil.getAllWithIndex<CharacterByCharacterRelation>(index, query);

    return await lastValueFrom(getAll$);
  }
}
