import { Component, Input } from '@angular/core';

@Component({
  selector: 'input-container',
  templateUrl: './input-container.component.html',
  styleUrl: './input-container.component.css',
})
export class InputContainerComponent {
  // добавим входные параметры для шаблона ввода
  @Input()
  label!: string;
  @Input()
  bgColor = 'while';
}
