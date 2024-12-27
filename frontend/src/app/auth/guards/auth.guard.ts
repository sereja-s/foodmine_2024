import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  // если пользователь прошёл идетификацию(а значит получил токен), его пропустит на страницу к которой применяется защитник
  if (userService.currentUser.token) {
    return true;
  }

  // иначе пользователь будет перенаправлен на указанный адрес (здесь- страница авторизации)
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
