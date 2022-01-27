import {Injectable} from '@angular/core';
import {Character} from '../../models/character';
import {IndexedDbUtil} from '@tk-ui/utils/indexed-db.util';
import {lastValueFrom} from 'rxjs';
import {Place} from '../../models/place';
import {CharacterByPlaceRelation} from '../../models/character-by-place-relation';
import {DbService} from '@wonder-writer/services/db/db.service';
import {RandomUtil} from '@tk-ui/utils/random.util';

@Injectable({
  providedIn: 'root'
})
export class CharacterByPlaceRelationStoreService {
  static storeName = 'CharacterByPlaceRelation';

  constructor(
    private dbService: DbService,
  ) {
  }

  get storeName(): string {
    return CharacterByPlaceRelationStoreService.storeName;
  }

  /**
   * Delete relation by character.
   * @param transaction transaction
   * @param character character model
   */
  async deleteRelationByCharacter(transaction: IDBTransaction, character: Character): Promise<void> {
    const store = transaction.objectStore(this.storeName);
    const index = store.index('characterId');

    const get$ = IndexedDbUtil.getAllWithIndex<CharacterByPlaceRelation>(index, character.id as string);
    const relations = await lastValueFrom(get$);
    const promises = relations.map(async (relation) => {
      const delete$ = IndexedDbUtil.deleteWithTransaction(transaction, this.storeName, relation.id as string);

      await lastValueFrom(delete$);
    });

    await Promise.all(promises);
  }

  /**
   * Delete relation by place.
   * @param transaction transaction
   * @param place place model
   */
  async deleteRelationByPlace(transaction: IDBTransaction, place: Place): Promise<void> {
    const store = transaction.objectStore(this.storeName);
    const index = store.index('placeId');

    const get$ = IndexedDbUtil.getAllWithIndex<CharacterByPlaceRelation>(index, place.id as string);
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
  async getRelationById(id: string): Promise<CharacterByPlaceRelation> {
    const get$ = IndexedDbUtil.get<CharacterByPlaceRelation>(this.dbService.db, this.storeName, id);
    const relation = await lastValueFrom(get$);

    if (relation) {
      return relation;
    } else {
      throw new Error('Character-by-place relation not found');
    }
  }

  /**
   * Get relations by place
   * @param place place
   */
  async getRelationsByPlace(place: Place): Promise<CharacterByPlaceRelation[]> {
    return await this._getRelationsByIndex('placeId', place.id as string);
  }

  /**
   * Get relations by character
   * @param character character
   */
  async getRelationsByCharacter(character: Character): Promise<CharacterByPlaceRelation[]> {
    return await this._getRelationsByIndex('characterId', character.id as string);
  }

  /**
   * Add relation
   * @param character character
   * @param place place
   * @param relation relation
   * @param memo memo
   */
  async addRelation(character: Character, place: Place, relation: string, memo: string): Promise<CharacterByPlaceRelation> {
    const model: CharacterByPlaceRelation = {
      id: RandomUtil.key(),
      relation,
      memo,
      characterId: character.id,
      placeId: place.id,
    };

    const add$ = IndexedDbUtil.add(this.dbService.db, this.storeName, model);

    await lastValueFrom(add$);

    return model;
  }

  /**
   * Update relation
   * @param model existing relation model
   * @param character character
   * @param place place
   * @param relation relation
   * @param memo memo
   */
  async updateRelation(model: CharacterByPlaceRelation, character: Character, place: Place, relation: string, memo: string): Promise<CharacterByPlaceRelation> {
    const _model: CharacterByPlaceRelation = {
      ...model,
      relation,
      memo,
      characterId: character.id,
      placeId: place.id,
    };

    delete _model.character;
    delete _model.place;

    const add$ = IndexedDbUtil.put(this.dbService.db, this.storeName, _model);

    await lastValueFrom(add$);

    return _model;
  }

  /**
   * Get relations by index
   * @param name index name
   * @param query query
   */
  private async _getRelationsByIndex(name: string, query: IDBValidKey | IDBKeyRange | null = null): Promise<CharacterByPlaceRelation[]> {
    const transaction = this.dbService.db.transaction(this.storeName, 'readonly');
    const store = transaction.objectStore(this.storeName);
    const index = store.index(name);

    const getAll$ = IndexedDbUtil.getAllWithIndex<CharacterByPlaceRelation>(index, query);

    return await lastValueFrom(getAll$);
  }
}
