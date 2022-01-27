import {Component, OnInit} from '@angular/core';
import {ProjectItem} from '../../../models/project-item';
import {ProjectStoreService} from '../../../services/db/project-store.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {finalize, from} from 'rxjs';
import {SortUtil} from '@tk-ui/utils/sort.util';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {HeaderService} from '../../../services/common/header.service';
import {LoadingCoverService} from '../../../services/common/loading-cover.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class ProjectsComponent implements OnInit {
  // Project search text.
  search = '';

  // Filtered project list.
  // This will be displayed.
  filteredProjects: ProjectItem[] = [];

  // All projects list.
  // It will not be displayed.
  private _projects: ProjectItem[] = [];

  constructor(
    private toastService: ToastService,
    private headerService: HeaderService,
    private loadingCoverService: LoadingCoverService,
    private projectStoreService: ProjectStoreService,
    private subscriptionService: SubscriptionService,
  ) {
  }

  ngOnInit(): void {
    this._hideHeaderActions();
    this._getProjects();
  }

  /**
   * Handle search text change event.
   * @param search changed search
   */
  onSearchChange(search: string): void {
    this.search = search;
    this._createDisplayableProjects();
  }

  /**
   * Handle project created event.
   * @param project created project
   */
  onProjectCreated(project: ProjectItem): void {
    this._unshiftCreatedProject(project);
    this._createDisplayableProjects();
  }

  /**
   * Handle project deleted event.
   * @param project deleted project
   */
  onProjectDeleted(project: ProjectItem): void {
    this._removeDeletedProject(project);
    this._createDisplayableProjects();
  }

  /**
   * Handle project edited event.
   * @param project edited project
   */
  onProjectEdited(project: ProjectItem): void {
    this._replaceEditedProject(project);
    this._createDisplayableProjects();
  }

  /**
   * Hide header back button and actions.
   */
  private _hideHeaderActions(): void {
    this.headerService.showBack = false;
    this.headerService.showMenu = false;
    this.headerService.actions = [];
  }

  /**
   * Get all project list to display.
   */
  private _getProjects(): void {
    const promise = this.projectStoreService.getProjects();
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => this._onProjectsLoaded(res),
        error: err => {
          console.error(err);

          this.toastService.open({
            message: '프로젝트 목록을 불러오지 못했습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_getProjects', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Handle projects loaded.
   * @param projects projects
   */
  private _onProjectsLoaded(projects: ProjectItem[]): void {
    this._projects = projects;
    this._createDisplayableProjects();
  }

  /**
   * Add created project to list.
   * @param project
   * @private
   */
  private _unshiftCreatedProject(project: ProjectItem): void {
    this._projects.unshift(project);
  }

  /**
   * Remove deleted project from list.
   * @param project deleted project
   */
  private _removeDeletedProject(project: ProjectItem): void {
    this._projects = this._projects.filter(item => item.id !== project.id);
  }

  /**
   * Replace edited project.
   * @param project edited project
   */
  private _replaceEditedProject(project: ProjectItem): void {
    this._projects = this._projects.map(item => {
      if (item.id === project.id) {
        return project;
      } else {
        return item;
      }
    });
  }

  /**
   * Create displayable projects by filtering and sorting the projects.
   */
  private _createDisplayableProjects(): void {
    this._filterProjects();
    this._orderFilteredProjects();
  }

  /**
   * Filter the project list by search text.
   */
  private _filterProjects(): void {
    this.filteredProjects = this._projects.filter(item => {
      return item.name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1;
    });
  }

  /**
   * Order filtered project list by `lastModifiedDate`.
   */
  private _orderFilteredProjects(): void {
    const sortFunction = SortUtil.sortMethodWithOrderByColumn<ProjectItem>({
      property: 'lastModifiedDate',
      order: 'desc',
      type: 'date',
    });

    this.filteredProjects.sort(sortFunction);
  }
}
