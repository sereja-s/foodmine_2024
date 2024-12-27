import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';

const VALIDATORS_MESSAGES: any = {
  required: 'Should not be empty',
  email: 'Email is not valid',
  minlength: 'Field is too short',
  notMatch: 'Password and Confirm does not match',
};

@Component({
  selector: 'input-validation',
  templateUrl: './input-validation.component.html',
  styleUrl: './input-validation.component.css',
})
export class InputValidationComponent implements OnInit, OnChanges {
  ngOnInit(): void {
    // подпишимся и вызовем метод проверки при изменении статуса валидации элемента управления
    this.control.statusChanges.subscribe(() => {
      this.checkValidation();
      // аналогично - когда мы что то вводим в поле ввода
      this.control.valueChanges.subscribe(() => {
        this.checkValidation();
      });
    });
  }
  // проведём валидацию при каждом изменении в компоненте
  ngOnChanges(changes: SimpleChanges): void {
    this.checkValidation();
  }
  // ввод абстрактного элемента управления (например: fc.email)
  @Input()
  control!: AbstractControl;
  // указание показывать ли ошибки
  @Input()
  showErrorsWhen: boolean = true;

  // сообщения об ошибках (будет заполняться на основе ключей ошибок в элементах управления)
  errorMessages: string[] = [];

  /**
   * метод проверки валидации, который заполняет свойство errorMessages
   */
  checkValidation() {
    // создадим константу, которая будет равна ошибкам элемента управления
    const errors = this.control.errors;
    if (!errors) {
      this.errorMessages = [];
      return;
    }
    // получим ключи ошибок, передав массив ошибок
    const errorKey = Object.keys(errors);

    // получим список сообщений об ошибках, сопоставив с ключами валидатора ошибок
    this.errorMessages = errorKey.map((key) => VALIDATORS_MESSAGES[key]);
  }
}
