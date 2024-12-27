import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  // укажем 4-е параметра:
  @Input()
  visible = false;
  @Input()
  notFoundMessage = 'НИЧЕГО НЕ НАЙДЕНО !';
  // текст ссылки для сброса
  @Input()
  resetLinkText = 'Reset';
  @Input()
  resetLinkRoute = '/';
}
