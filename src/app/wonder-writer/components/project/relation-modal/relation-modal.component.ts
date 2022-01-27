import {Component, Inject, OnInit} from '@angular/core';
import {MODAL_DATA, MODAL_REF, ModalRef} from '@tk-ui/components/modal/models/modal-ref';
import {LoadingCoverService} from '@wonder-writer/services/common/loading-cover.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {RelationJointStoreService} from '@wonder-writer/services/db/relation-joint-store.service';
import {finalize, from} from 'rxjs';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {OptionItem} from '@tk-ui/models/option-item';
import {Character} from '@wonder-writer/models/character';
import {Place} from '@wonder-writer/models/place';
import {Episode} from '@wonder-writer/models/episode';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ValidatorUtil} from '@tk-ui/utils/validator.util';
import {CharacterByCharacterRelation} from '@wonder-writer/models/character-by-character-relation';
import {CharacterByPlaceRelation} from '@wonder-writer/models/character-by-place-relation';
import {EpisodeByCharacterRelation} from '@wonder-writer/models/episode-by-character-relation';
import {EpisodeByPlaceRelation} from '@wonder-writer/models/episode-by-place-relation';
import {RelationUtil} from '@wonder-writer/utils/relation.util';
import {
  CharacterByCharacterRelationStoreService
} from '@wonder-writer/services/db/character-by-character-relation-store.service';
import {
  CharacterByPlaceRelationStoreService
} from '@wonder-writer/services/db/character-by-place-relation-store.service';
import {
  EpisodeByCharacterRelationStoreService
} from '@wonder-writer/services/db/episode-by-character-relation-store.service';
import {EpisodeByPlaceRelationStoreService} from '@wonder-writer/services/db/episode-by-place-relation-store.service';
import {AvailableRelation} from '@wonder-writer/models/available-relation';

export interface RelationModalData {
  // Project id
  projectId: string;
  // Relation starting model type
  from: 'character' | 'place' | 'episode';
  // Relation targeting model type
  to: 'character' | 'place';
  // Relation starting model
  fromModel: Character | Place | Episode;
  // Modal mode
  mode: 'create' | 'edit';
  // Relation to edit
  relation?: AvailableRelation;
}

@Component({
  selector: 'app-relation-modal',
  templateUrl: './relation-modal.component.html',
  styleUrls: ['./relation-modal.component.scss'],
  providers: [
    SubscriptionService,
  ],
})
export class RelationModalComponent implements OnInit {
  // Target select label
  targetLabel!: string;

  // Select options
  options: OptionItem<string>[] = [];

  // Relation target selector
  target: FormControl = new FormControl('', Validators.required);

  // Relation
  relation: FormControl = new FormControl('', ValidatorUtil.textRequired);

  // Memo
  memo: FormControl = new FormControl('');

  // Form group
  formGroup: FormGroup = new FormGroup({
    target: this.target,
    relation: this.relation,
    memo: this.memo,
  });
  // Loaded characters
  private _characters: Character[] = [];
  // Loaded places
  private _places: Place[] = [];
  // Relation target modal
  private _targetModel?: Character | Place | Episode;
  // Target invalid message
  private _targetInvalidMessage!: string;

  constructor(
    @Inject(MODAL_REF) private modalRef: ModalRef<RelationModalComponent>,
    @Inject(MODAL_DATA) private data: RelationModalData,
    private toastService: ToastService,
    private loadingCoverService: LoadingCoverService,
    private relationJointStoreService: RelationJointStoreService,
    private characterByCharacterRelationStoreService: CharacterByCharacterRelationStoreService,
    private characterByPlaceRelationStoreService: CharacterByPlaceRelationStoreService,
    private episodeByCharacterRelationStoreService: EpisodeByCharacterRelationStoreService,
    private episodeByPlaceRelationStoreService: EpisodeByPlaceRelationStoreService,
    private subscriptionService: SubscriptionService,
  ) {
  }

  /**
   * Get form valid state
   */
  get valid(): boolean {
    this.formGroup.markAllAsTouched();

    return this.formGroup.valid;
  }

  /**
   * Return true for character-by-character relation
   */
  get isCharacterByCharacter(): boolean {
    return this.data.from === 'character' && this.data.to === 'character';
  }

  /**
   * Return true for character-by-place relation
   */
  get isCharacterByPlace(): boolean {
    return this.data.from === 'character' && this.data.to === 'place';
  }

  /**
   * Return true for episode-by-character relation
   */
  get isEpisodeByCharacter(): boolean {
    return this.data.from === 'episode' && this.data.to === 'character';
  }

  /**
   * Return true for episode-by-place relation
   */
  get isEpisodeByPlace(): boolean {
    return this.data.from === 'episode' && this.data.to === 'place';
  }

  /**
   * Get target model's id
   */
  get targetModelId(): string | void {
    if (this.isCharacterByCharacter) {
      return (this.data.relation as CharacterByCharacterRelation).toCharacterId;
    } else if (this.isCharacterByPlace) {
      return (this.data.relation as CharacterByPlaceRelation).placeId;
    } else if (this.isEpisodeByCharacter) {
      return (this.data.relation as EpisodeByCharacterRelation).characterId;
    } else if (this.isEpisodeByPlace) {
      return (this.data.relation as EpisodeByPlaceRelation).placeId;
    } else {
      throw new Error(`Invalid relation type from: '${this.data.from}' to: '${this.data.to}'`);
    }
  }

  ngOnInit(): void {
    this._setStaticMessages();
    this._subscribeTargetValueChanges();
    this._getOptions();
  }

  /**
   * Close modal with response
   * @param res response
   */
  close(res?: AvailableRelation): void {
    this.modalRef.close(res);
  }

  /**
   * Handle submit
   */
  onSubmit(): void {
    if (this.valid) {
      this._onFormValidSubmit();
    } else {
      this._onFormInvalidSubmit();
    }
  }

  /**
   * Set target label
   */
  private _setStaticMessages(): void {
    this.targetLabel = RelationUtil.getTargetLabel(this.data.to);
    this._targetInvalidMessage = RelationUtil.getTargetInvalidMessage(this.data.to);
  }

  /**
   * Get options
   */
  private _getOptions(): void {
    switch (this.data.to) {
      case 'character': {
        this._getAllCharacters();
        break;
      }

      case 'place': {
        this._getAllPlaces();
        break;
      }

      default: {
        console.error(`Invalid relation type to '${this.data.to}'`);

        this.toastService.open({
          message: '관계 정보 오류로 인해 설정할 수 없습니다',
          type: ToastType.error,
        });

        this.close();
      }
    }
  }

  /**
   * Get all characters
   */
  private _getAllCharacters(): void {
    const promise = this.relationJointStoreService.getAllCharactersByProjectId(this.data.projectId);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => {
          this._characters = res;
          this._createOptions(res);
          this._prefillFormValues();
        },
        error: err => {
          console.error(err);

          this.toastService.open({
            message: '인물 목록을 불러오지 못했습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_getAllCharacters', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Get all places
   */
  private _getAllPlaces(): void {
    const promise = this.relationJointStoreService.getAllPlacesByProjectId(this.data.projectId);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => {
          this._places = res;
          this._createOptions(res);
          this._prefillFormValues();
        },
        error: err => {
          console.error(err);

          this.toastService.open({
            message: '장소 목록을 불러오지 못했습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_getAllPlaces', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Create options with loaded data
   * @param data loaded data
   */
  private _createOptions(data: Character[] | Place[] | Episode[]): void {
    this.options = (data as any[]).filter(item => item.id !== this.data.fromModel.id).map(item => {
      return new OptionItem<string>(item.name, item.id);
    });
  }

  /**
   * Prefill form values when 'edit' mode.
   */
  private _prefillFormValues(): void {
    if (this.data.mode === 'edit') {
      try {
        this.formGroup.setValue({
          target: this.targetModelId || '',
          relation: this.data.relation?.relation || '',
          memo: this.data.relation?.memo || '',
        });
      } catch (e) {
        console.error(e);

        this.toastService.open({
          message: '관계 정보 오류로 인해 수정할 수 없습니다',
          type: ToastType.error,
        });

        this.close();
      }
    }
  }

  /**
   * Subscribe target value change to update target model
   */
  private _subscribeTargetValueChanges(): void {
    const sub = this.target.valueChanges
      .subscribe(() => {
        this._onTargetValueChange();
      });

    this.subscriptionService.store('_subscribeTargetValueChanges', sub);
  }

  /**
   * Handle target value change event
   */
  private _onTargetValueChange(): void {
    switch (this.data.to) {
      case 'character': {
        this._setTargetModel(this._characters);
        break;
      }

      case 'place': {
        this._setTargetModel(this._places);
        break;
      }
    }
  }

  /**
   * Set relation target model
   * @param data options data
   */
  private _setTargetModel(data: Character[] | Place[] | Episode[]): void {
    this._targetModel = (data as any[]).find(item => item.id === this.target.value);
  }

  /**
   * Handle form valid submit
   */
  private _onFormValidSubmit(): void {
    if (this.data.mode === 'create') {
      this._createRelation();
    } else {
      this._updateRelation();
    }
  }

  /**
   * Create relation
   */
  private _createRelation(): void {
    if (this.isCharacterByCharacter) {
      this._createCharacterByCharacterRelation();
    } else if (this.isCharacterByPlace) {
      this._createCharacterByPlaceRelation();
    } else if (this.isEpisodeByCharacter) {
      this._createEpisodeByCharacterRelation();
    } else if (this.isEpisodeByPlace) {
      this._createEpisodeByPlaceRelation();
    } else {
      this._handleInvalidRelationTypeError();
    }
  }

  /**
   * Create character by character relation
   */
  private _createCharacterByCharacterRelation(): void {
    const fromCharacter = this.data.fromModel as Character;
    const toCharacter = this._targetModel as Character;
    const relation = this.relation.value;
    const memo = this.memo.value;

    const promise = this.characterByCharacterRelationStoreService.addRelation(fromCharacter, toCharacter, relation, memo);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => this._handleCreateRelationSuccess(res),
        error: err => this._handleCreateRelationError(err),
      });

    this.subscriptionService.store('_createCharacterByCharacterRelation', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Create character by place relation
   */
  private _createCharacterByPlaceRelation(): void {
    const character = this.data.fromModel as Character;
    const place = this._targetModel as Place;
    const relation = this.relation.value;
    const memo = this.memo.value;

    const promise = this.characterByPlaceRelationStoreService.addRelation(character, place, relation, memo);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => this._handleCreateRelationSuccess(res),
        error: err => this._handleCreateRelationError(err),
      });

    this.subscriptionService.store('_createCharacterByPlaceRelation', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Create episode by character relation
   */
  private _createEpisodeByCharacterRelation(): void {
    const episode = this.data.fromModel as Episode;
    const character = this._targetModel as Character;
    const relation = this.relation.value;
    const memo = this.memo.value;

    const promise = this.episodeByCharacterRelationStoreService.addRelation(episode, character, relation, memo);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => this._handleCreateRelationSuccess(res),
        error: err => this._handleCreateRelationError(err),
      });

    this.subscriptionService.store('_createEpisodeByCharacterRelation', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Create episode by place relation
   */
  private _createEpisodeByPlaceRelation(): void {
    const episode = this.data.fromModel as Episode;
    const place = this._targetModel as Place;
    const relation = this.relation.value;
    const memo = this.memo.value;

    const promise = this.episodeByPlaceRelationStoreService.addRelation(episode, place, relation, memo);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => this._handleCreateRelationSuccess(res),
        error: err => this._handleCreateRelationError(err),
      });

    this.subscriptionService.store('_createEpisodeByPlaceRelation', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Handle creating relation success
   * @param res response
   */
  private _handleCreateRelationSuccess(res: AvailableRelation): void {
    this.toastService.open({
      message: '관계가 설정되었습니다',
    });

    this._getSavedRelationById(res.id);
  }

  /**
   * Handle creating relation error
   * @param error error
   */
  private _handleCreateRelationError(error: Error): void {
    console.error(error);

    this.toastService.open({
      message: '관계를 설정하지 못했습니다',
      type: ToastType.error,
    });
  }

  /**
   * Create relation
   */
  private _updateRelation(): void {
    if (this.isCharacterByCharacter) {
      this._updateCharacterByCharacterRelation();
    } else if (this.isCharacterByPlace) {
      this._updateCharacterByPlaceRelation();
    } else if (this.isEpisodeByCharacter) {
      this._updateEpisodeByCharacterRelation();
    } else if (this.isEpisodeByPlace) {
      this._updateEpisodeByPlaceRelation();
    } else {
      this._handleInvalidRelationTypeError();
    }
  }

  /**
   * Update character by character relation
   */
  private _updateCharacterByCharacterRelation(): void {
    const fromCharacter = this.data.fromModel as Character;
    const toCharacter = this._targetModel as Character;
    const relation = this.relation.value;
    const memo = this.memo.value;
    const model = this.data.relation as CharacterByCharacterRelation;

    const promise = this.characterByCharacterRelationStoreService.updateRelation(model, fromCharacter, toCharacter, relation, memo);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => this._handleUpdateRelationSuccess(res),
        error: err => this._handleUpdateRelationError(err),
      });

    this.subscriptionService.store('_updateCharacterByCharacterRelation', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Update character by place relation
   */
  private _updateCharacterByPlaceRelation(): void {
    const character = this.data.fromModel as Character;
    const place = this._targetModel as Place;
    const relation = this.relation.value;
    const memo = this.memo.value;
    const model = this.data.relation as CharacterByPlaceRelation;

    const promise = this.characterByPlaceRelationStoreService.updateRelation(model, character, place, relation, memo);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => this._handleUpdateRelationSuccess(res),
        error: err => this._handleUpdateRelationError(err),
      });

    this.subscriptionService.store('_updateCharacterByPlaceRelation', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Update episode by character relation
   */
  private _updateEpisodeByCharacterRelation(): void {
    const episode = this.data.fromModel as Episode;
    const character = this._targetModel as Character;
    const relation = this.relation.value;
    const memo = this.memo.value;
    const model = this.data.relation as EpisodeByCharacterRelation;

    const promise = this.episodeByCharacterRelationStoreService.updateRelation(model, episode, character, relation, memo);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => this._handleUpdateRelationSuccess(res),
        error: err => this._handleUpdateRelationError(err),
      });

    this.subscriptionService.store('_updateEpisodeByCharacterRelation', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Update episode by place relation
   */
  private _updateEpisodeByPlaceRelation(): void {
    const episode = this.data.fromModel as Episode;
    const place = this._targetModel as Place;
    const relation = this.relation.value;
    const memo = this.memo.value;
    const model = this.data.relation as EpisodeByPlaceRelation;

    const promise = this.episodeByPlaceRelationStoreService.updateRelation(model, episode, place, relation, memo);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => this._handleUpdateRelationSuccess(res),
        error: err => this._handleUpdateRelationError(err),
      });

    this.subscriptionService.store('_updateEpisodeByPlaceRelation', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Handle creating relation success
   * @param res response
   */
  private _handleUpdateRelationSuccess(res: AvailableRelation): void {
    this.toastService.open({
      message: '관계가 수정되었습니다',
    });

    this._getSavedRelationById(res.id);
  }

  /**
   * Handle creating relation error
   * @param error error
   */
  private _handleUpdateRelationError(error: Error): void {
    console.error(error);

    this.toastService.open({
      message: '관계를 수정하지 못했습니다',
      type: ToastType.error,
    });
  }

  /**
   * Show error when `from` and `to` type are invalid which can't be handled by the component.
   */
  private _handleInvalidRelationTypeError(): void {
    console.error(`Invalid relation type from: '${this.data.from}' to: '${this.data.to}'`);

    this.toastService.open({
      message: '관계를 설정할 수 없습니다. 다시 시도해주세요.',
      type: ToastType.error,
    });
  }

  /**
   * Handle form invalid submit
   */
  private _onFormInvalidSubmit(): void {
    if (this.target.invalid) {
      this.toastService.open({
        message: '대상을 선택해주세요',
        type: ToastType.error,
      });
    }

    if (this.relation.invalid) {
      this.toastService.open({
        message: '관계를 입력해주세요',
        type: ToastType.error,
      });
    }
  }

  /**
   * Get created or updated relation by id
   * @param id id
   */
  private _getSavedRelationById(id: string): void {
    if (this.isCharacterByCharacter) {
      this._getCharacterByCharacterRelationById(id);
    } else if (this.isCharacterByPlace) {
      this._getCharacterByPlaceRelationById(id);
    } else if (this.isEpisodeByCharacter) {
      this._getEpisodeByCharacterRelationById(id);
    } else if (this.isEpisodeByPlace) {
      this._getEpisodeByPlaceRelationById(id);
    } else {
      console.error(`Invalid relation type from: '${this.data.from}' to: '${this.data.to}'`);

      this.toastService.open({
        message: '수정된 관계 설정을 불러올 수 없습니다. 다시 시도해주세요.',
        type: ToastType.error,
      });
    }
  }

  /**
   * Get character by character relation by id
   * @param id relation id
   */
  private _getCharacterByCharacterRelationById(id: string): void {
    const promise = this.relationJointStoreService.getCharacterByCharacterRelationById(id);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => this.close(res),
        error: err => this._handleGetRelationError(err),
      });

    this.subscriptionService.store('_getCharacterByCharacterRelationById', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Get character by place relation by id
   * @param id relation id
   */
  private _getCharacterByPlaceRelationById(id: string): void {
    const promise = this.relationJointStoreService.getCharacterByPlaceRelationById(id);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => this.close(res),
        error: err => this._handleGetRelationError(err),
      });

    this.subscriptionService.store('_getCharacterByPlaceRelationById', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Get episode by character relation by id
   * @param id relation id
   */
  private _getEpisodeByCharacterRelationById(id: string): void {
    const promise = this.relationJointStoreService.getEpisodeByCharacterRelationById(id);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => this.close(res),
        error: err => this._handleGetRelationError(err),
      });

    this.subscriptionService.store('_getEpisodeByCharacterRelationById', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Get episode by place relation by id
   * @param id relation id
   */
  private _getEpisodeByPlaceRelationById(id: string): void {
    const promise = this.relationJointStoreService.getEpisodeByPlaceRelationById(id);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => this.close(res),
        error: err => this._handleGetRelationError(err),
      });

    this.subscriptionService.store('_getEpisodeByPlaceRelationById', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Handle get relation error
   * @param error error
   */
  private _handleGetRelationError(error: Error): void {
    console.error(error);

    this.toastService.open({
      message: '수정된 관계 설정을 가져오지 못했습니다',
      type: ToastType.error,
    });
  }
}
