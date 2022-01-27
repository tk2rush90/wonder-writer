import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {
  // Header title
  @Input() header!: string;

  // Hierarchy name
  @Input() name!: string;

  // Label name
  @Input() label!: string;

  // Content value
  @Input() content!: string;

  // Content value change emitter
  @Output() contentChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
