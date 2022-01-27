import { Injectable } from '@angular/core';
import {IndexedDbUtil} from '@tk-ui/utils/indexed-db.util';
import {from, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  static dbName = 'WonderWriter';

  // This will be initialized after calling `connect()` method.
  private _db!: IDBDatabase;

  constructor() {
  }

  /**
   * Return db instance
   */
  get db(): IDBDatabase {
    return this._db;
  }

  /**
   * Connect to 'FirstDb'.
   * You can use the database instance from anywhere by injecting this service.
   */
  connect(): Observable<void> {
    const promise = new Promise<void>((resolve, reject) => {
      IndexedDbUtil.connect(DbService.dbName)
        .subscribe({
          next: db => {
            this._db = db;
            resolve();
          },
          error: err => reject(err),
        });
    });

    return from(promise);
  }
}
