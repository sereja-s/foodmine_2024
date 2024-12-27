import { Injectable } from '@angular/core';
import { Cart } from '../shared/model/Cart';
import { BehaviorSubject, Observable } from 'rxjs';
import { Food } from '../shared/model/Food';
import { CartItem } from '../shared/model/CartItem';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // поле(свойство) в котором хранится корзина
  private cart: Cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);

  constructor() {}

  /**
   * метод добавления товаров в корзину
   */
  addToCart(food: Food): void {
    let cartItem = this.cart.items.find((item) => item.food.id === food.id);
    if (cartItem) return;

    this.cart.items.push(new CartItem(food));

    // сохраним изменения в локальном хранилище
    this.setCartToLocalStorage();
  }

  /**
   * метод удаления товара из корзины
   */
  removeFromCart(foodId: string): void {
    this.cart.items = this.cart.items.filter((item) => item.food.id != foodId);

    this.setCartToLocalStorage();
  }

  /**
   * метод изменения количества
   */
  changeQuantity(foodId: string, quantity: number) {
    let cartItem = this.cart.items.find((item) => item.food.id === foodId);
    if (!cartItem) return;

    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.price;

    this.setCartToLocalStorage();
  }

  /**
   * метод очистки корзины
   */
  clearCart() {
    this.cart = new Cart();

    this.setCartToLocalStorage();
  }

  /**
   * метод возвращающий наблюдаемый объект типа корзина (он нужен для доступа к изменениям в корзине только через сервис корзины)
   */
  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  /**
   * Покучим крайнее значение корзины. Объёкт типа: BehaviorSubject всегда хранит крайнее значение
   */
  getCart() {
    return this.cartSubject.value;
  }

  /**
   * приватный метод сохраняющий корзину в локальном хранилище (корзина не будет очищаться при обновлении(перезагрузке) страницы в браузере)
   */
  private setCartToLocalStorage(): void {
    // укажем общую стоимость и количество товаров в корзине
    // метод reduce() будет вызываться для каждого товара в корзине прибавляя его цену к сумме за предыдущие товаров (в начале установили- 0).
    this.cart.totalPrice = this.cart.items.reduce(
      (prevSum, currentItem) => prevSum + currentItem.price,
      0
    );
    // Тоже самое для количества товаров в корзине
    this.cart.totalCount = this.cart.items.reduce(
      (prevSum, currentItem) => prevSum + currentItem.quantity,
      0
    );

    // преобразуем объект корзина в строку в формате: json
    const cartJson = JSON.stringify(this.cart);
    // зададим(установим) ключ для локального хранилища (здксь- Cart) и передадим ему json-строку корзины в качестве значения
    localStorage.setItem('Cart', cartJson);

    // если мы что то сохраняем в локальном хранилище, это означает, что мы меняем содержимое корзины, поэтому любой кто слушает наблюдаемое состояние корзины, должен быть уведомлен об этом (о следующем значении корзины)
    this.cartSubject.next(this.cart);
  }

  /**
   * приватный метод получения корзины из локального хранилища
   */
  private getCartFromLocalStorage(): Cart {
    // получим json-файл корзины из локального хранилища по ключу (здесь- Cart)
    const cartJson = localStorage.getItem('Cart');

    // если данные о корзине существуют, преобразуем полученные данные из json-формата в объект корзины, иначе создадим новый объект корзины (пустую корзину) и затем вернём полученный результат
    return cartJson ? JSON.parse(cartJson) : new Cart();
  }
}
