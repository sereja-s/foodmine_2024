import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'default-button',
  templateUrl: './default-button.component.html',
  styleUrl: './default-button.component.css',
})
export class DefaultButtonComponent {
  // точки ввода в шаблоне
  @Input()
  type: 'submit' | 'button' = 'submit';
  @Input()
  text: string = 'Submit';
  @Input()
  bgColor = '#e72929';
  @Input()
  color = 'white';
  @Input()
  fontSizeRem = 1.3;
  @Input()
  widthRem = 12;

  // точка вывода, т.к. нам нужно задать событие onXlick
  @Output()
  onClick = new EventEmitter();
}
