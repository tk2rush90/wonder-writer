import {EventEmitter, Injectable} from '@angular/core';
import {IconDefinitions} from '@tk-ui/components/icon/icon-defs';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

export interface HeaderAction {
  // The name of icon for header action.
  name: keyof typeof IconDefinitions;
  // Click event handler.
  click: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  // Back button click emitter.
  private _onBackClick: EventEmitter<void> = new EventEmitter();

  constructor() {
  }

  // The show back button state behavior subject.
  private _showBack$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // The header actions behavior subject.

  /**
   * Return show back button state as observable.
   */
  get showBack$(): Observable<boolean> {
    return this._showBack$.asObservable();
  }

  // Showing mobile menu state
  private _showMenu$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Return show menu button state as observable.
   */
  get showMenu$(): Observable<boolean> {
    return this._showMenu$.asObservable();
  }

  // Empty will not show any actions.
  private _actions$: BehaviorSubject<HeaderAction[]> = new BehaviorSubject<HeaderAction[]>([]);

  /**
   * Return header actions as observable.
   */
  get actions$(): Observable<HeaderAction[]> {
    return this._actions$.asObservable();
  }

  /**
   * Set show back button state.
   * @param state state
   */
  set showBack(state: boolean) {
    this._showBack$.next(state);
  }

  /**
   * Set show menu button state.
   * @param state state
   */
  set showMenu(state: boolean) {
    this._showMenu$.next(state);
  }

  /**
   * Set header actions to show.
   * @param actions actions
   */
  set actions(actions: HeaderAction[]) {
    this._actions$.next(actions);
  }

  /**
   * Emit back button click event.
   */
  emitBackClick(): void {
    this._onBackClick.emit();
  }

  /**
   * Subscribe back button click event.
   * @param handler event handler
   */
  subscribeBackClick(handler: () => void): Subscription {
    return this._onBackClick.subscribe(handler);
  }
}
