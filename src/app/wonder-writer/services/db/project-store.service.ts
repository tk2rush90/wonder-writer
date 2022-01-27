import {Injectable} from '@angular/core';
import {DbService} from './db.service';
import {ProjectItem} from '../../models/project-item';
import {HierarchyStoreService} from './hierarchy-store.service';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {IndexedDbUtil} from '@tk-ui/utils/indexed-db.util';
import {lastValueFrom} from 'rxjs';
import {ProjectSettingsStoreService} from '@wonder-writer/services/db/project-settings-store.service';

export const PROJECT_THEME_LIST = [
  '#B55353',
  '#81B553',
  '#537DB5',
  '#B553B5',
  '#53A4B5',
  '#B59B53',
  '#B56E53',
  '#B5536A',
  '#5353B5',
  '#53B59A',
  '#53B563',
];

@Injectable({
  providedIn: 'root'
})
export class ProjectStoreService {
  static storeName = 'Project';

  constructor(
    private dbService: DbService,
    private hierarchyStoreService: HierarchyStoreService,
    private projectSettingsStoreService: ProjectSettingsStoreService,
  ) {
  }

  /**
   * Return static store name.
   */
  get storeName(): string {
    return ProjectStoreService.storeName;
  }

  /**
   * Add new project.
   * @param name project name
   */
  async addProject(name: string): Promise<ProjectItem> {
    const transaction = this.dbService.db
      .transaction(
        [
          this.storeName,
          this.hierarchyStoreService.storeName,
          this.projectSettingsStoreService.storeName,
        ],
        'readwrite',
      );

    try {
      const project: ProjectItem = {
        name,
        id: RandomUtil.key(),
        lastModifiedDate: Date.now(),
        theme: RandomUtil.pick(PROJECT_THEME_LIST),
      };

      const addProject$ = IndexedDbUtil.addWithTransaction(transaction, this.storeName, project);

      await lastValueFrom(addProject$);

      await this.projectSettingsStoreService.addProjectSettingsWithTransaction(transaction, project);
      await this.hierarchyStoreService.initProjectHierarchies(transaction, project);

      return project;
    } catch (e) {
      transaction.abort();

      throw e;
    }
  }

  /**
   * Update existing project.
   * @param project project
   */
  async updateProject(project: ProjectItem): Promise<ProjectItem> {
    project.lastModifiedDate = Date.now();

    const update$ = IndexedDbUtil.put(this.dbService.db, this.storeName, project);

    await lastValueFrom(update$);

    return project;
  }

  /**
   * Return all projects.
   */
  async getProjects(): Promise<ProjectItem[]> {
    const getProjects$ = IndexedDbUtil.getAll<ProjectItem>(this.dbService.db, this.storeName);

    return await lastValueFrom(getProjects$);
  }

  /**
   * Delete projects.
   * It will delete all related data as well.
   * @param project project
   */
  async deleteProject(project: ProjectItem): Promise<void> {
    const transaction = this.dbService.db.transaction(this.dbService.db.objectStoreNames as any, 'readwrite');

    try {
      await this.projectSettingsStoreService.deleteProjectSettingWithTransaction(transaction, project);
      await this.hierarchyStoreService.deleteProjectHierarchies(transaction, project);

      const deleteProject$ = IndexedDbUtil.deleteWithTransaction(transaction, this.storeName, project.id as string);

      await lastValueFrom(deleteProject$);
    } catch (e) {
      transaction.abort();

      throw e;
    }
  }
}
