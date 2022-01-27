import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ValidatorUtil} from '@tk-ui/utils/validator.util';

@Component({
  selector: 'app-single-text-form',
  templateUrl: './single-text-form.component.html',
  styleUrls: ['./single-text-form.component.scss']
})
export class SingleTextFormComponent implements OnInit {
  // Field label
  @Input() label!: string;

  // Form submit emitter
  @Output() formSubmit: EventEmitter<void> = new EventEmitter<void>();

  // Text form control
  text: FormControl = new FormControl('', [
    ValidatorUtil.textRequired,
  ]);

  // Form group
  formGroup: FormGroup = new FormGroup({
    text: this.text,
  });

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * Set initial value
   * @param value value
   */
  @Input() set initialValue(value: string) {
    this.text.setValue(value);
  }

  /**
   * Return field value.
   */
  get value(): string {
    return this.text.value;
  }

  /**
   * Return form valid state.
   */
  get valid(): boolean {
    this.formGroup.markAllAsTouched();

    return this.formGroup.valid;
  }
}
