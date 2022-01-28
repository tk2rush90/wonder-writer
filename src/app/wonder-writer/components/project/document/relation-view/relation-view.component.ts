import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Character} from '@wonder-writer/models/character';
import {Place} from '@wonder-writer/models/place';
import {Episode} from '@wonder-writer/models/episode';
import {
  RelationActionItem
} from '@wonder-writer/components/project/document/relation-view-actions/relation-view-actions.component';
import {ModalService} from '@tk-ui/components/modal/services/modal.service';
import {
  RelationModalComponent,
  RelationModalData
} from '@wonder-writer/components/project/relation-modal/relation-modal.component';
import {ActivatedRoute, Router} from '@angular/router';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {CharacterByCharacterRelation} from '@wonder-writer/models/character-by-character-relation';
import {CharacterByPlaceRelation} from '@wonder-writer/models/character-by-place-relation';
import {EpisodeByCharacterRelation} from '@wonder-writer/models/episode-by-character-relation';
import {EpisodeByPlaceRelation} from '@wonder-writer/models/episode-by-place-relation';
import {AvailableRelation} from '@wonder-writer/models/available-relation';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {HierarchyStoreService} from '@wonder-writer/services/db/hierarchy-store.service';
import {HierarchyService} from '@wonder-writer/services/common/hierarchy.service';
import {LoadingCoverService} from '@wonder-writer/services/common/loading-cover.service';
import {finalize, from} from 'rxjs';
import {RelationJointStoreService} from '@wonder-writer/services/db/relation-joint-store.service';
import {
  DeleteRelationModalComponent
} from '@wonder-writer/components/project/delete-relation-modal/delete-relation-modal.component';

// Relation view type
export type RelationViewType = 'character' | 'place' | 'episode';

@Component({
  selector: 'app-relation-view',
  templateUrl: './relation-view.component.html',
  styleUrls: ['./relation-view.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class RelationViewComponent implements OnInit {
  // Selected action
  selectedAction!: RelationActionItem;

  // Actions
  actions: RelationActionItem[] = [];

  // Relation view type
  type!: RelationViewType;

  // Local loading state
  loading = false;

  // Relations to display
  private _relations: AvailableRelation[] = [];

  // Project id
  private _projectId!: string;

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private modalService: ModalService,
    private loadingCoverService: LoadingCoverService,
    private hierarchyService: HierarchyService,
    private hierarchyStoreService: HierarchyStoreService,
    private relationJointStoreService: RelationJointStoreService,
    private subscriptionService: SubscriptionService,
  ) {
  }

  /**
   * Get relations as character by character relations
   */
  get characterByCharacterRelations(): CharacterByCharacterRelation[] {
    return this._relations as CharacterByCharacterRelation[];
  }

  /**
   * Get relations as character by place relations
   */
  get characterByPlaceRelations(): CharacterByPlaceRelation[] {
    return this._relations as CharacterByPlaceRelation[];
  }

  /**
   * Get relations as episode by character relations
   */
  get episodeByCharacterRelations(): EpisodeByCharacterRelation[] {
    return this._relations as EpisodeByCharacterRelation[];
  }

  /**
   * Get relations as episode by place relations
   */
  get episodeByPlaceRelations(): EpisodeByPlaceRelation[] {
    return this._relations as EpisodeByPlaceRelation[]
  }

  // Character
  private _character!: Character;

  /**
   * Get character
   */
  get character(): Character {
    return this._character;
  }

  /**
   * Set character data to show character relations
   * @param character character
   */
  @Input() set character(character: Character) {
    this._character = character;
    this.type = 'character';

    this._buildCharacterViewActions();
    this._setInitialValue();
    this._getRelations();
  }

  // Place
  private _place!: Place;

  /**
   * Get place
   */
  get place(): Place {
    return this._place;
  }

  /**
   * Set place data to show the place relations
   * @param place place
   */
  @Input() set place(place: Place) {
    this._place = place;
    this.type = 'place';

    this._buildPlaceViewActions();
    this._setInitialValue();
    this._getRelations();
  }

  // Episode
  private _episode!: Episode;

  /**
   * Get episode
   */
  get episode(): Episode {
    return this._episode;
  }

  /**
   * Set episode data to show episode relations
   * @param episode episode
   */
  @Input() set episode(episode: Episode) {
    this._episode = episode;
    this.type = 'episode';

    this._buildEpisodeViewActions();
    this._setInitialValue();
    this._getRelations();
  }

  ngOnInit(): void {
    this._subscribeActivatedRouteParamMap();
    this._subscribeHierarchyChanged();
  }

  /**
   * Handle selected action change
   * @param action action
   */
  onSelectedActionChange(action: RelationActionItem): void {
    this.selectedAction = action;
    this._getRelations();
  }

  /**
   * Open create relation modal
   */
  openCreateRelationModal(): void {
    this.modalService.open(RelationModalComponent, {
      data: {
        from: this.type,
        to: this.selectedAction.value,
        fromModel: this._character || this._place || this._episode,
        projectId: this._projectId,
        mode: 'create',
      } as RelationModalData,
      closeOnNavigating: true,
      onClose: res => {
        if (res) {
          this._relations.push(res);
        }
      },
    });
  }

  /**
   * Open edit relation modal
   * @param relation relation to edit
   */
  openUpdateRelationModal(relation: AvailableRelation): void {
    this.modalService.open(RelationModalComponent, {
      data: {
        relation,
        from: this.type,
        to: this.selectedAction.value,
        fromModel: this._character || this._place || this._episode,
        projectId: this._projectId,
        mode: 'edit',
      } as RelationModalData,
      closeOnNavigating: true,
      onClose: res => {
        if (res) {
          this._replaceRelation(res);
        }
      },
    });
  }

  /**
   * Open delete relation modal
   * @param relation relation
   */
  openDeleteRelationModal(relation: AvailableRelation): void {
    this.modalService.open(DeleteRelationModalComponent, {
      closeOnNavigating: true,
      onClose: res => {
        if (res) {
          this._deleteRelation(relation);
        }
      }
    });
  }

  /**
   * Navigate to relation with hierarchy id and type
   * @param id hierarchy id
   */
  navigateWith(id: string): void {
    this.router.navigate(['/writer/project', this._projectId, id])
      .catch(e => {
        console.error(e);

        this.toastService.open({
          message: '문서를 열 수 없습니다',
          type: ToastType.error,
        });
      });
  }

  /**
   * Subscribe hierarchy changed emitter and update relations by getting again
   */
  private _subscribeHierarchyChanged(): void {
    const sub = this.hierarchyService
      .subscribeHierarchyChanged(() => {
        this._getRelations();
      });

    this.subscriptionService.store('_subscribeHierarchyChanged', sub);
  }

  /**
   * Replace updated relation with existing one
   * @param relation updated relation
   */
  private _replaceRelation(relation: AvailableRelation): void {
    const index = this._relations.findIndex(item => item.id === relation.id);

    if (index !== -1) {
      this._relations.splice(index, 1, relation);
    }
  }

  /**
   * Subscribe parent activated route param map
   */
  private _subscribeActivatedRouteParamMap(): void {
    const sub = this.activatedRoute
      .parent!
      .paramMap
      .subscribe(res => {
        const projectId = res.get('id');

        if (projectId) {
          this._projectId = projectId;
        }
      });

    this.subscriptionService.store('_subscribeActivatedRouteParamMap', sub);
  }

  /**
   * Build character view actions
   */
  private _buildCharacterViewActions(): void {
    this.actions = [
      new RelationActionItem('인물 관계 설정', 'character', true),
      new RelationActionItem('장소 관계 설정', 'place', true),
      new RelationActionItem('사건 관계 조회', 'episode', false),
    ];
  }

  /**
   * Build place view actions
   */
  private _buildPlaceViewActions(): void {
    this.actions = [
      new RelationActionItem('인물 관계 조회', 'character', false),
      new RelationActionItem('사건 관계 조회', 'episode', false),
    ];
  }

  /**
   * Build episode view actions
   */
  private _buildEpisodeViewActions(): void {
    this.actions = [
      new RelationActionItem('인물 관계 설정', 'character', true),
      new RelationActionItem('장소 관계 설정', 'place', true),
    ];
  }

  /**
   * Set initial value
   */
  private _setInitialValue(): void {
    this.changeDetectorRef.detectChanges();
    this.selectedAction = this.actions[0];
  }

  /**
   * Get relations
   */
  private _getRelations(): void {
    switch (this.type) {
      case 'character': {
        this._getCharacterTypeRelations();
        break;
      }

      case 'place': {
        this._getPlaceTypeRelations();
        break;
      }

      case 'episode': {
        this._getEpisodeTypeRelations();
        break;
      }
    }
  }

  /**
   * Get relations for character
   */
  private _getCharacterTypeRelations(): void {
    switch (this.selectedAction!.value) {
      case 'character': {
        this._getCharacterByCharacterRelationsByFromCharacter();
        break;
      }

      case 'place': {
        this._getCharacterByPlaceRelationsByCharacter();
        break;
      }

      case 'episode': {
        this._getEpisodeByCharacterRelationsByCharacter();
        break;
      }
    }
  }

  /**
   * Get relations for place
   */
  private _getPlaceTypeRelations(): void {
    switch (this.selectedAction!.value) {
      case 'character': {
        this._getCharacterByPlaceRelationsByPlace();
        break;
      }

      case 'episode': {
        this._getEpisodeByPlaceRelationsByPlace();
        break;
      }
    }
  }

  /**
   * Get relations for episode
   */
  private _getEpisodeTypeRelations(): void {
    switch (this.selectedAction!.value) {
      case 'character': {
        this._getEpisodeByCharacterRelationsByEpisode();
        break;
      }

      case 'place': {
        this._getEpisodeByPlaceRelationsByEpisode();
        break;
      }
    }
  }

  /**
   * Get character by character relations by from character
   */
  private _getCharacterByCharacterRelationsByFromCharacter(): void {
    const promise = this.relationJointStoreService.getCharacterByCharacterRelationsByFromCharacter(this._character);
    const sub = from(promise)
      .pipe(finalize(() => this._stopGetRelationsLoading()))
      .subscribe({
        next: res => this._relations = res,
        error: err => this._handleGetRelationsError(err),
      });

    this.subscriptionService.store('_getCharacterByCharacterRelationsByFromCharacter', sub);
    this._startGetRelationsLoading();
  }

  /**
   * Get character by place relations by character
   */
  private _getCharacterByPlaceRelationsByCharacter(): void {
    const promise = this.relationJointStoreService.getCharacterByPlaceRelationsByCharacter(this._character);
    const sub = from(promise)
      .pipe(finalize(() => this._stopGetRelationsLoading()))
      .subscribe({
        next: res => this._relations = res,
        error: err => this._handleGetRelationsError(err),
      });

    this.subscriptionService.store('_getCharacterByPlaceRelationsByCharacter', sub);
    this._startGetRelationsLoading();
  }

  /**
   * Get episode by character relations by character
   */
  private _getEpisodeByCharacterRelationsByCharacter(): void {
    const promise = this.relationJointStoreService.getEpisodeByCharacterRelationsByCharacter(this._character);
    const sub = from(promise)
      .pipe(finalize(() => this._stopGetRelationsLoading()))
      .subscribe({
        next: res => this._relations = res,
        error: err => this._handleGetRelationsError(err),
      });

    this.subscriptionService.store('_getEpisodeByCharacterRelationsByCharacter', sub);
    this._startGetRelationsLoading();
  }

  /**
   * Get character by place relations by place
   */
  private _getCharacterByPlaceRelationsByPlace(): void {
    const promise = this.relationJointStoreService.getCharacterByPlaceRelationsByPlace(this._place);
    const sub = from(promise)
      .pipe(finalize(() => this._stopGetRelationsLoading()))
      .subscribe({
        next: res => this._relations = res,
        error: err => this._handleGetRelationsError(err),
      });

    this.subscriptionService.store('_getCharacterByPlaceRelationsByPlace', sub);
    this._startGetRelationsLoading();
  }

  /**
   * Get episode by place relations by place
   */
  private _getEpisodeByPlaceRelationsByPlace(): void {
    const promise = this.relationJointStoreService.getEpisodeByPlaceRelationsByPlace(this._place);
    const sub = from(promise)
      .pipe(finalize(() => this._stopGetRelationsLoading()))
      .subscribe({
        next: res => this._relations = res,
        error: err => this._handleGetRelationsError(err),
      });

    this.subscriptionService.store('_getEpisodeByPlaceRelationsByPlace', sub);
    this._startGetRelationsLoading();
  }

  /**
   * Get episode by character relations by episode
   */
  private _getEpisodeByCharacterRelationsByEpisode(): void {
    const promise = this.relationJointStoreService.getEpisodeByCharacterRelationsByEpisode(this._episode);
    const sub = from(promise)
      .pipe(finalize(() => this._stopGetRelationsLoading()))
      .subscribe({
        next: res => this._relations = res,
        error: err => this._handleGetRelationsError(err),
      });

    this.subscriptionService.store('_getEpisodeByCharacterRelationsByEpisode', sub);
    this._startGetRelationsLoading();
  }

  /**
   * Get episode by place relations by episode
   */
  private _getEpisodeByPlaceRelationsByEpisode(): void {
    const promise = this.relationJointStoreService.getEpisodeByPlaceRelationsByEpisode(this._episode);
    const sub = from(promise)
      .pipe(finalize(() => this._stopGetRelationsLoading()))
      .subscribe({
        next: res => this._relations = res,
        error: err => this._handleGetRelationsError(err),
      });

    this.subscriptionService.store('_getEpisodeByPlaceRelationsByEpisode', sub);
    this._startGetRelationsLoading();
  }

  /**
   * Start get relations loading
   */
  private _startGetRelationsLoading(): void {
    this.loadingCoverService.showLoading = true;
    this.loading = true;
  }

  /**
   * Stop get relations loading
   */
  private _stopGetRelationsLoading(): void {
    this.loadingCoverService.showLoading = false;
    this.loading = false;
  }

  /**
   * Handle get relations error
   * @param error error
   */
  private _handleGetRelationsError(error: Error): void {
    console.error(error);

    this.toastService.open({
      message: '관계 설정을 불러오지 못했습니다',
      type: ToastType.error,
    });
  }

  /**
   * Delete relation
   * @param relation relation
   */
  private _deleteRelation(relation: AvailableRelation): void {
    const promise = this.relationJointStoreService.deleteRelation(this.type, this.selectedAction!.value, relation);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: () => {
          this._removeRelationFromList(relation);

          this.toastService.open({
            message: '관계가 삭제되었습니다',
          });
        },
        error: err => {
          console.error(err);

          this.toastService.open({
            message: '관계를 삭제하지 못했습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_deleteRelation', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Remove deleted relation from list
   * @param relation relation
   */
  private _removeRelationFromList(relation: AvailableRelation): void {
    this._relations = this._relations.filter(item => item.id !== relation.id);
  }
}
