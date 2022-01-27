import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingCoverService {
  constructor() {
  }

  private _showLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Get show loading state as observable.
   */
  get showLoading$(): Observable<boolean> {
    return this._showLoading$.asObservable();
  }

  /**
   * Set show loading state.
   * @param state state
   */
  set showLoading(state: boolean) {
    this._showLoading$.next(state);
  }
}
