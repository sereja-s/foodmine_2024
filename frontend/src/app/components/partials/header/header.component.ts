import { Component } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/model/User';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  cartQuantity = 0;
  user!: User;

  constructor(cartService: CartService, private userService: UserService) {
    cartService.getCartObservable().subscribe((newCart) => {
      this.cartQuantity = newCart.totalCount;
    });
    // подпишимся на каждого нового наблюдаемого пользователя из сервиса-пользователя
    userService.userObsevable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  /**
   * выход пользователя из системы авторизации
   */
  logout() {
    this.userService.logout();
  }

  /**
   * свойство-геттер вернёт авторизованного пользователя
   */
  get isAuth() {
    return this.user.token;
  }
}
