import { Component } from '@angular/core';
import { Cart } from '../../../shared/model/Cart';
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../shared/model/CartItem';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css',
})
export class CartPageComponent {
  cart!: Cart;

  constructor(private cartService: CartService) {
    // получим наблюдаемое значение корзины, подпишимся, чтобы обновлять его каждый раз когда появляется новое значение корзины
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
    });
  }

  /**
   * удаление элемента корзины
   */
  removeFromCart(cartItem: CartItem) {
    this.cartService.removeFromCart(cartItem.food.id);
  }

  /**
   * изменение количества товаров в элементе корзины
   */
  changeQuantity(cartItem: CartItem, quantityInString: string) {
    // преобразуем количество из строки в число
    const quantity = parseInt(quantityInString);
    this.cartService.changeQuantity(cartItem.food.id, quantity);
  }
}
