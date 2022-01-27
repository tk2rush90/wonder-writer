import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {HierarchyDirectoryType, HierarchyItem} from '../../models/hierarchy-item';
import {
  HierarchyDropzoneComponent
} from '../../components/project/hierarchies/hierarchy-dropzone/hierarchy-dropzone.component';
import {
  CurrentHierarchyComponent
} from '../../components/project/hierarchies/current-hierarchy/current-hierarchy.component';

export interface DroppableEvent {
  parentId: string;
  nextId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HierarchyService {
  // Droppable dropzone component list.
  private _droppableDropzones: HierarchyDropzoneComponent[] = [];
  // Droppable hierarchy component list.
  private _droppableHierarchies: CurrentHierarchyComponent[] = [];
  // Hierarchy changed (deleted or updated) emitter
  private _hierarchyChanged: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }

  // Hierarchy drawer opened state
  private _hierarchyDrawerOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Return hierarchy drawer opened state as observable
   */
  get hierarchyDrawerOpened$(): Observable<boolean> {
    return this._hierarchyDrawerOpened$.asObservable();
  }

  // Dragging hierarchy DOMRect to calculate overlapping area.
  private _draggingHierarchyDOMRect$: BehaviorSubject<DOMRect | undefined> = new BehaviorSubject<DOMRect | undefined>(undefined);

  /**
   * Return dragging hierarchy DOMRect as observable
   */
  get draggingHierarchyDOMRect$(): Observable<DOMRect | undefined> {
    return this._draggingHierarchyDOMRect$.asObservable();
  }

  // Dragging hierarchy behavior subject.
  private _draggingHierarchy$: BehaviorSubject<HierarchyItem | undefined> = new BehaviorSubject<HierarchyItem | undefined>(undefined);

  /**
   * Return dragging hierarchy as observable
   */
  get draggingHierarchy$(): Observable<HierarchyItem | undefined> {
    return this._draggingHierarchy$.asObservable();
  }

  // Dragging hierarchy mouse event to set position.
  private _draggingMouseEvent$: BehaviorSubject<MouseEvent | TouchEvent | undefined> = new BehaviorSubject<MouseEvent | TouchEvent | undefined>(undefined);

  /**
   * Return dragging mouse event as observable
   */
  get draggingMouseEvent$(): Observable<MouseEvent | TouchEvent | undefined> {
    return this._draggingMouseEvent$.asObservable();
  }

  // Dragging scope by directory type.
  private _draggingScope$: BehaviorSubject<HierarchyDirectoryType | undefined> = new BehaviorSubject<HierarchyDirectoryType | undefined>(undefined);

  /**
   * Return dragging scope as observable
   */
  get draggingScope$(): Observable<HierarchyDirectoryType | undefined> {
    return this._draggingScope$.asObservable();
  }

  // Opened document hierarchy
  private _openedHierarchy$: BehaviorSubject<HierarchyItem | undefined> = new BehaviorSubject<HierarchyItem | undefined>(undefined);

  /**
   * Return opened hierarchy as observable
   */
  get openedHierarchy$(): Observable<HierarchyItem | undefined> {
    return this._openedHierarchy$.asObservable();
  }

  /**
   * Set hierarchy drawer opened state
   * @param opened opened state
   */
  set hierarchyDrawerOpened(opened: boolean) {
    this._hierarchyDrawerOpened$.next(opened);
  }

  /**
   * Set dragging hierarchy DOMRect
   * @param domRect DOMRect
   */
  set draggingHierarchyDOMRect(domRect: DOMRect | undefined) {
    this._draggingHierarchyDOMRect$.next(domRect);
  }

  /**
   * Set dragging hierarchy
   * @param hierarchy hierarchy
   */
  set draggingHierarchy(hierarchy: HierarchyItem | undefined) {
    this._draggingHierarchy$.next(hierarchy);
  }

  /**
   * Set dragging mouse event
   * @param event mouse event
   */
  set draggingMouseEvent(event: MouseEvent | TouchEvent | undefined) {
    this._draggingMouseEvent$.next(event);
  }

  /**
   * Set dragging scope
   * @param type directory type
   */
  set draggingScope(type: HierarchyDirectoryType | undefined) {
    this._draggingScope$.next(type);
  }

  /**
   * Register droppable dropzone to service
   * @param dropzone dropzone component
   */
  registerDroppableDropzone(dropzone: HierarchyDropzoneComponent): void {
    this._droppableDropzones.push(dropzone);
  }

  /**
   * Register droppable current hierarchy to service
   * @param hierarchy current hierarchy component
   */
  registerDroppableHierarchy(hierarchy: CurrentHierarchyComponent): void {
    this._droppableHierarchies.push(hierarchy);
  }

  /**
   * Unregister droppable dropzone to service
   * @param dropzone dropzone component
   */
  unregisterDroppableDropzone(dropzone: HierarchyDropzoneComponent): void {
    this._droppableDropzones = this._droppableDropzones.filter(item => item !== dropzone);
  }

  /**
   * Unregister droppable current hierarchy to service
   * @param hierarchy current hierarchy component
   */
  unregisterDroppableHierarchy(hierarchy: CurrentHierarchyComponent): void {
    this._droppableHierarchies = this._droppableHierarchies.filter(item => item !== hierarchy);
  }

  /**
   * Check and return droppable dropzone
   * @param event mouse event
   * @param draggingDOMRect dragging dom rect
   */
  checkDroppableDropzones(event: MouseEvent | TouchEvent, draggingDOMRect: DOMRect): HierarchyDropzoneComponent | undefined {
    const droppable = this._droppableDropzones.filter(dropzone => {
      dropzone.checkDraggingHierarchyContained(event, draggingDOMRect);

      return dropzone.droppable;
    });

    return droppable[0];
  }

  /**
   * Check and return droppable current hierarchy
   * @param event mouse event
   * @param draggingDOMRect dragging dom rect
   */
  checkDroppableHierarchy(event: MouseEvent | TouchEvent, draggingDOMRect: DOMRect): CurrentHierarchyComponent | undefined {
    const droppable = this._droppableHierarchies.filter(hierarchy => {
      hierarchy.checkDraggingHierarchyContained(event, draggingDOMRect);

      return hierarchy.droppable;
    });

    return droppable[0];
  }

  /**
   * Open document hierarchy
   * @param hierarchy hierarchy to open
   */
  openDocumentHierarchy(hierarchy: HierarchyItem): void {
    this._openedHierarchy$.next(hierarchy);
  }

  /**
   * Close document hierarchy
   */
  closeDocumentHierarchy(): void {
    this._openedHierarchy$.next(undefined);
  }

  /**
   * Emit hierarchy changed emitter
   */
  emitHierarchyChanged(): void {
    this._hierarchyChanged.emit();
  }

  /**
   * Subscribe hierarchy changed emitter
   * @param handler handler
   */
  subscribeHierarchyChanged(handler: () => void): Subscription {
    return this._hierarchyChanged.subscribe(handler);
  }
}
