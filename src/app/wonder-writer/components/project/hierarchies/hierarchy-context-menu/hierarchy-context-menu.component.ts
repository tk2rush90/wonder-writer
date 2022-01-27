import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {AvailableKey, EventUtil} from '@tk-ui/utils/event.util';
import {animate, state, style, transition, trigger} from '@angular/animations';

export interface HierarchyContextMenuItem {
  // The name of menu.
  name: string;
  // Click event handler.
  click: () => void;
}

@Component({
  selector: 'app-hierarchy-context-menu',
  templateUrl: './hierarchy-context-menu.component.html',
  styleUrls: ['./hierarchy-context-menu.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({
        opacity: 0,
      })),
      state('visible', style({
        opacity: 1,
      })),
      transition('void <=> visible', animate('.2s')),
    ]),
  ]
})
export class HierarchyContextMenuComponent implements OnInit, AfterViewInit {
  // Context menu data.
  @Input() data: HierarchyContextMenuItem[] = [];

  // Close emitter.
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  // Bind fade in animation state.
  @HostBinding('@fadeIn') fadeIn = 'visible';

  // Component ready state to handle window events.
  private _ready = false;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._ready = true;
    });
  }

  /**
   * Handle window wheel event to close context menu.
   */
  @HostListener('window:wheel')
  onWindowWheel(): void {
    if (this._ready) {
      this.close.emit();
    }
  }

  /**
   * handle host contextmenu event
   * @param event mouse event
   */
  @HostListener('contextmenu', ['$event'])
  onHostContextMenu(event: MouseEvent): void {
    EventUtil.neutralize(event);
  }

  /**
   * Handle window click event.
   * @param event mouse event
   */
  @HostListener('window:click', ['$event'])
  onWindowClick(event: MouseEvent): void {
    this._detectClickEvent(event, true);
  }

  /**
   * Handle window contextmenu event
   * @param event mouse event
   */
  @HostListener('window:contextmenu', ['$event'])
  onWindowContextMenu(event: MouseEvent): void {
    this._detectClickEvent(event);
  }

  /**
   * Handle keyboard event to close with ESC button.
   * @param event keyboard event
   */
  @HostListener('window:keydown', ['$event'])
  onWindowKeydown(event: KeyboardEvent): void {
    if (EventUtil.isKey(event, AvailableKey.Escape)) {
      this.close.emit();
    }
  }

  @HostListener('window:touchstart', ['$event'])
  onWindowTouchStart(event: TouchEvent): void {
    this._detectClickEvent(event);
  }

  /**
   * Detect click event position to emit close emitter.
   * @param event mouse event
   * @param ignoreParent parent ignore state
   */
  private _detectClickEvent(event: MouseEvent | TouchEvent, ignoreParent = false): void {
    if (this._ready) {
      const target = event.target as HTMLElement;
      const element = this.elementRef.nativeElement;
      const containedInElement = element.contains(target);
      const containedInParent = !ignoreParent && element.parentElement!.contains(target);

      if (!containedInElement && !containedInParent) {
        this.close.emit();
      }
    }
  }
}
