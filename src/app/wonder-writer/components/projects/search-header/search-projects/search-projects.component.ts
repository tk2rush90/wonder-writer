import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-search-projects',
  templateUrl: './search-projects.component.html',
  styleUrls: ['./search-projects.component.scss']
})
export class SearchProjectsComponent implements OnInit {
  // Project search text.
  @Input() search = '';

  // Search change emitter.
  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
