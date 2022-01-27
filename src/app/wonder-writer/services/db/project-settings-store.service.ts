import {Injectable} from '@angular/core';
import {ProjectSettings} from '@wonder-writer/models/project-settings';
import {DbService} from '@wonder-writer/services/db/db.service';
import {IndexedDbUtil} from '@tk-ui/utils/indexed-db.util';
import {lastValueFrom} from 'rxjs';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {ProjectItem} from '@wonder-writer/models/project-item';

@Injectable({
  providedIn: 'root'
})
export class ProjectSettingsStoreService {
  static storeName = 'ProjectSettings';

  constructor(
    private dbService: DbService,
  ) {
  }

  get storeName(): string {
    return ProjectSettingsStoreService.storeName;
  }

  /**
   * Get project setting by project id
   * @param projectId project id
   */
  async getProjectSettingsByProjectId(projectId: string): Promise<ProjectSettings> {
    const transaction = this.dbService.db.transaction(this.storeName);
    const store = transaction.objectStore(this.storeName);
    const index = store.index('projectId');
    const get$ = IndexedDbUtil.getWithIndex<ProjectSettings>(index, projectId);
    const settings = await lastValueFrom(get$);

    if (settings) {
      return settings;
    } else {
      throw new Error('Project settings not found');
    }
  }

  /**
   * Add new project settings with transaction
   * @param transaction transaction
   * @param project added project
   */
  async addProjectSettingsWithTransaction(transaction: IDBTransaction, project: ProjectItem): Promise<ProjectSettings> {
    const settings: ProjectSettings = {
      id: RandomUtil.key(),
      projectId: project.id as string,
      contentWidth: 540,
      contentFont: 'NotoSans',
      theme: 'dark',
    };

    const add$ = IndexedDbUtil.addWithTransaction(transaction, this.storeName, settings);

    await lastValueFrom(add$);

    return settings;
  }

  /**
   * Delete project setting with transaction
   * @param transaction transaction
   * @param project project to delete
   */
  async deleteProjectSettingWithTransaction(transaction: IDBTransaction, project: ProjectItem): Promise<void> {
    const store = transaction.objectStore(this.storeName);
    const index = store.index('projectId');

    const get$ = IndexedDbUtil.getWithIndex<ProjectSettings>(index, project.id as string);
    const result = await lastValueFrom(get$);

    if (result) {
      const delete$ = IndexedDbUtil.deleteWithTransaction(transaction, this.storeName, result.id);

      await lastValueFrom(delete$);
    }
  }

  /**
   * Update project settings
   * @param settings settings
   */
  async updateProjectSettings(settings: ProjectSettings): Promise<void> {
    const update$ = IndexedDbUtil.put(this.dbService.db, this.storeName, settings);

    await lastValueFrom(update$);
  }
}
