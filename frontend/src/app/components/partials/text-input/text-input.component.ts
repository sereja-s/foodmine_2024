import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'text-input',
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css',
})
export class TextInputComponent {
  @Input()
  control!: AbstractControl;
  @Input()
  showErrorsWhen: boolean = true;
  @Input()
  label!: string;
  @Input()
  type: 'text' | 'password' | 'email' = 'text';

  // преобразуем поле типа: AbstractControl в тип - FormControl в геттере, получив свойство formControl
  get formControl() {
    return this.control as FormControl;
  }
}
