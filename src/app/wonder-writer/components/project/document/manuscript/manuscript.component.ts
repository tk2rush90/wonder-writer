import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {DocumentContainer} from '../document-container/document-container';
import {ManuscriptStoreService} from '../../../../services/db/manuscript-store.service';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {finalize, from} from 'rxjs';
import {Manuscript} from '../../../../models/manuscript';
import {ToastService, ToastType} from '@tk-ui/components/toast/service/toast.service';
import {LoadingCoverService} from '../../../../services/common/loading-cover.service';
import Quill from 'quill';
import {DocumentAction} from '../document-header-action/document-header-action.component';
import {ParsingUtil} from '@tk-ui/utils/parsing.util';
import {isEqual} from 'lodash';
import {ProjectSettingsService} from '@wonder-writer/services/common/project-settings.service';

@Component({
  selector: 'app-manuscript',
  templateUrl: './manuscript.component.html',
  styleUrls: ['./manuscript.component.scss'],
  providers: [
    SubscriptionService,
  ]
})
export class ManuscriptComponent extends DocumentContainer implements OnInit, OnDestroy {
  // Content element
  @ViewChild('content') contentRef!: ElementRef<HTMLElement>;

  // Scroll container element
  @ViewChild('container') containerRef!: ElementRef<HTMLElement>;

  // Manuscript
  manuscript!: Manuscript;

  // Document header actions
  actions: DocumentAction[][] = [];

  // Global action disabled state
  disabled = true;

  // Initial Quill contents delta
  private _origin!: any;

  // Format size actions
  private _formatSize1 = new DocumentAction('format-size-1', () => this._setFontSize('small'));
  private _formatSize2 = new DocumentAction('format-size-2', () => this._setFontSize());
  private _formatSize3 = new DocumentAction('format-size-3', () => this._setFontSize('large'));
  private _formatSize4 = new DocumentAction('format-size-4', () => this._setFontSize('huge'));

  // Format align actions
  private _alignLeft = new DocumentAction('format-align-left', () => this._setAlign());
  private _alignCenter = new DocumentAction('format-align-center', () => this._setAlign('center'));
  private _alignRight = new DocumentAction('format-align-right', () => this._setAlign('right'));
  private _alignJustify = new DocumentAction('format-align-justify', () => this._setAlign('justify'));

  // Format text actions
  private _formatBold = new DocumentAction('format-bold', () => this._toggleFormatStyle('bold'));
  private _formatItalic = new DocumentAction('format-italic', () => this._toggleFormatStyle('italic'));
  private _formatUnderline = new DocumentAction('format-underline', () => this._toggleFormatStyle('underline'));
  private _formatStrike = new DocumentAction('format-strike', () => this._toggleFormatStyle('strike'));

  // Format indent actions
  private _formatIncreaseIndent = new DocumentAction('format-indent-increase', () => this._increaseIndent())
  private _formatDecreaseIndent = new DocumentAction('format-indent-decrease', () => this._decreaseIndent())

  // Quill instance
  private _quill!: Quill;

  constructor(
    protected override toastService: ToastService,
    protected override projectSettingsService: ProjectSettingsService,
    protected override subscriptionService: SubscriptionService,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private loadingCoverService: LoadingCoverService,
    private manuscriptStoreService: ManuscriptStoreService,
  ) {
    super(toastService, projectSettingsService, subscriptionService);
  }

  /**
   * Get content changed state
   */
  override get hasChanges(): boolean {
    if (this._quill) {
      return !isEqual(this._quill?.getContents(), this._origin);
    } else {
      return false;
    }
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this._buildDocumentActions();
  }

  override ngOnDestroy(): void {
    this._offEditorChangeEvent();
    super.ngOnDestroy();
  }

  /**
   * Handle hierarchy change
   */
  protected override _onHierarchyChange(): void {
    this._getManuscript();
  }

  /**
   * Override after manually saved handler
   */
  protected override _onManuallySaved(): void {
    this._origin = this._quill.getContents();
  }

  /**
   * Handle save changes
   * @param next next callback
   * @param error error callback
   */
  protected override _saveChanges(next: () => void, error: (err: Error) => void): void {
    this.manuscript.content = this._quill.getContents();

    const promise = this.manuscriptStoreService.updateManuscript(this.manuscript);
    const sub = from(promise)
      .subscribe({
        next: () => next(),
        error: err => error(err),
      });

    this.subscriptionService.store('_saveChanges', sub);
  }

  /**
   * Build document actions
   */
  private _buildDocumentActions(): void {
    this.actions = [
      [
        this._formatSize1,
        this._formatSize2,
        this._formatSize3,
        this._formatSize4,
      ],
      [
        this._alignLeft,
        this._alignCenter,
        this._alignRight,
        this._alignJustify,
      ],
      [
        this._formatBold,
        this._formatItalic,
        this._formatUnderline,
        this._formatStrike,
      ],
      [
        this._formatIncreaseIndent,
        this._formatDecreaseIndent,
      ],
    ];
  }

  /**
   * Get manuscript with hierarchy id
   */
  private _getManuscript(): void {
    const promise = this.manuscriptStoreService.getManuscriptByHierarchy(this._hierarchy);
    const sub = from(promise)
      .pipe(finalize(() => this.loadingCoverService.showLoading = false))
      .subscribe({
        next: res => {
          this.manuscript = res;
          this.changeDetectorRef.detectChanges();

          this._initQuill();
          this._onEditorChangeEvent();
        },
        error: e => {
          console.error(e);

          this.toastService.open({
            message: '원고를 불러오지 못했습니다',
            type: ToastType.error,
          });
        },
      });

    this.subscriptionService.store('_getManuscript', sub);
    this.loadingCoverService.showLoading = true;
  }

  /**
   * Initialize quill instance
   */
  private _initQuill(): void {
    this._quill = new Quill(this.contentRef.nativeElement, {
      placeholder: '내용을 입력하세요.',
      scrollingContainer: this.containerRef.nativeElement,
      formats: [
        'bold',
        'italic',
        'font',
        'size',
        'strike',
        'underline',
        'indent',
        'align',
      ],
    });

    if (this.manuscript.content) {
      this._quill.setContents(this.manuscript.content);
      this._origin = this._quill.getContents();
    }
  }

  /**
   * On editor change event of quill
   */
  private _onEditorChangeEvent(): void {
    this._quill.on('editor-change', this._handleEditorChangeEvent);
  }

  /**
   * Handle selection change event of quill
   */
  private _handleEditorChangeEvent = (): void => {
    const selection = this._quill.getSelection();

    if (selection) {
      this.disabled = false;

      const format = this._quill.getFormat(selection);
      const indent = ParsingUtil.toInteger(format['indent']);

      // toggle size activated state
      this._formatSize1.active = format['size'] === 'small';
      this._formatSize2.active = format['size'] === 'normal' || !format['size'];
      this._formatSize3.active = format['size'] === 'large';
      this._formatSize4.active = format['size'] === 'huge';
      // toggle align activated state
      this._alignLeft.active = format['align'] === 'left' || !format['align'];
      this._alignCenter.active = format['align'] === 'center';
      this._alignRight.active = format['align'] === 'right';
      this._alignJustify.active = format['align'] === 'justify';
      // toggle text format activated state
      this._formatBold.active = format['bold'];
      this._formatItalic.active = format['italic'];
      this._formatUnderline.active = format['underline'];
      this._formatStrike.active = format['strike'];
      // toggle indent disabled state
      this._formatIncreaseIndent.disabled = indent >= 5;
      this._formatDecreaseIndent.disabled = indent <= 0;
    } else {
      this.disabled = true;
    }
  }

  /**
   * Off editor change event of quill
   */
  private _offEditorChangeEvent(): void {
    this._quill.off('editor-change', this._handleEditorChangeEvent);
  }

  /**
   * Set font size for selection
   * Undefined size is `normal`
   * @param size size
   */
  private _setFontSize(size?: string): void {
    this._quill.format('size', size);
  }

  /**
   * Set text align
   * Undefined align is `left`
   * @param align align
   */
  private _setAlign(align?: string): void {
    this._quill.format('align', align);
  }

  /**
   * Toggle format style
   * @param style style
   */
  private _toggleFormatStyle(style: string): void {
    const format = this._quill.getFormat();

    if (format) {
      this._quill.format(style, !format[style]);
    }
  }

  /**
   * Increase indent
   */
  private _increaseIndent(): void {
    const indent = this._getCurrentIndent();

    if (indent < 5) {
      this._quill.format('indent', indent + 1);
    }
  }

  /**
   * Decrease indent
   */
  private _decreaseIndent(): void {
    const indent = this._getCurrentIndent();

    if (indent > 0) {
      this._quill.format('indent', indent - 1);
    }
  }

  /**
   * Get current indent value
   */
  private _getCurrentIndent(): number {
    let indent = 0;
    const format = this._quill.getFormat();

    if (format) {
      indent = ParsingUtil.toInteger(format['indent']);
    }

    return indent;
  }
}
