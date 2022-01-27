import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ProjectSettings} from '@wonder-writer/models/project-settings';

@Injectable({
  providedIn: 'root'
})
export class ProjectSettingsService {
  constructor() {
  }

  // Project settings
  private _settings$: BehaviorSubject<ProjectSettings | undefined> = new BehaviorSubject<ProjectSettings | undefined>(undefined);

  /**
   * Return settings as observable
   */
  get settings$(): Observable<ProjectSettings | undefined> {
    return this._settings$.asObservable();
  }

  /**
   * Set settings
   * @param settings settings
   */
  set settings(settings: ProjectSettings | undefined) {
    this._settings$.next(settings);
  }
}
