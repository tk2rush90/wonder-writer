import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss']
})
export class ModalHeaderComponent implements OnInit {
  // Close emitter.
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
