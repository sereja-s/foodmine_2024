import {
  HttpEvent,
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const userService = inject(UserService);

  // получаем текущего пользователя
  const user = userService.currentUser;

  // если пользователь авторизован (прищёл его токен)
  if (user.token) {
    // клонирование создаёт новый объект из текущего. Здесь мы не меняем запрос, а создаём новый объект и изменяем некоторые поля
    req = req.clone({
      // для поля заголовка устанавливаем
      setHeaders: {
        // поле(свойство) в котором будет храниться токен может называться по разному(здесь- access_token)
        access_token: user.token,
      },
    });
  }
  // отправляем такой запрос (с токеном в заголовке) на сервер
  return next(req);
};
