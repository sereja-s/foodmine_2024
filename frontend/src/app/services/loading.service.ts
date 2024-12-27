import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  // загрузка по умолчанию выключена (false)
  // с помощъю этой переменной все классы, использующие этот функционал будут информированы о состоянии загрузки
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  constructor() {}

  /**
   * Метод включает картинку загрузки и все кто подключён к прослушиванию, будут уведомлены об этом
   */
  showLoading() {
    this.isLoadingSubject.next(true);
  }
  /**
   * Метод отключает картинку загрузки и все кто подключён к прослушиванию, будут уведомлены об этом
   */
  hideLoading() {
    this.isLoadingSubject.next(false);
  }

  /**
   * Геттер возвращает свойство с объектом, которое будет доступно только для чтения (отключается возможность вносить изменения в его значение из вне)
   */
  get isLoading() {
    return this.isLoadingSubject.asObservable();
  }
}
