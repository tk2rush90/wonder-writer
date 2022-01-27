import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {DocumentAction} from '../document-header-action/document-header-action.component';

@Component({
  selector: 'app-document-header',
  templateUrl: './document-header.component.html',
  styleUrls: ['./document-header.component.scss']
})
export class DocumentHeaderComponent implements OnInit {
  // Header actions
  @Input() actions: DocumentAction[][] = [];

  // Actions disabled state
  @Input() disabled = false;

  // Has changes state
  // Bind to savable class
  @HostBinding('class.ww-savable') @Input() hasChanges = false;

  // Save click emitter
  @Output() save: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
