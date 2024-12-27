import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { tap } from 'rxjs';

// определим глобальную переменную: ожидание запроса (используем её для обработки нескольких запросов отправляемых на сервер) Когда все ожидающие запросы будут выполнены, скрываем картинку-загрузку
var pendingRequests = 0;

// перехватчике-загрузки мы можем видеть какие запросыы отправляются на сервер и что делать дальше
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  // при ерехвате запроса покажем картинку-загрузки
  loadingService.showLoading();
  // добавим один ожидющий запрос
  pendingRequests = pendingRequests + 1;

  return next(req).pipe(
    tap({
      next: (event) => {
        // тип события: Response означает,что событие выполнено
        if (event.type === HttpEventType.Response) {
          pendingRequests = pendingRequests - 1;
          if (pendingRequests === 0) loadingService.hideLoading();
        }
      },
      error: (_) => {
        pendingRequests = pendingRequests - 1;
        if (pendingRequests === 0) loadingService.hideLoading();
      },
    })
  );
};
