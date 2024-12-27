import { Component, OnInit } from '@angular/core';
import { Order } from '../../../shared/model/Order';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css',
})
export class CheckoutPageComponent implements OnInit {
  order: Order = new Order();
  checkoutForm!: FormGroup;
  constructor(
    cartService: CartService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private orderService: OrderService,
    private router: Router
  ) {
    // получим корзину из сервиса корзины и добавим её в заказ
    const cart = cartService.getCart();
    // установим список товаров заказа и общую стоимость
    this.order.items = cart.items;
    this.order.totalPrice = cart.totalPrice;
  }
  ngOnInit(): void {
    // получим данные текущего пользователя
    let { name, address } = this.userService.currentUser;
    // заполним соответствующие поля формы заказа полученными данными пользователя
    this.checkoutForm = this.formBuilder.group({
      name: [name, Validators.required],
      address: [address, Validators.required],
    });
  }

  get fc() {
    return this.checkoutForm.controls;
  }

  /**
   * Метод создания заказа
   */
  createOrder() {
    if (this.checkoutForm.invalid) {
      this.toastrService.warning(
        'ЗАПОЛНИТЕ ПОЛЯ ФОРМЫ ПОЖАЛУЙСТА',
        'ФОРМА ЗАПОЛНЕНА НЕ КОРРЕКТНО!'
      );
      return;
    }

    // проверим указаны ли для заказа значения широты и долготы адреса
    if (!this.order.addressLatLng) {
      this.toastrService.warning(
        'Please select your location on the map',
        'Location'
      );
      return;
    }

    // формируем данные для создания нового заказа и отправки на сервер
    this.order.name = this.fc.name.value;
    this.order.address = this.fc.address.value;

    //console.log(this.order);

    this.orderService.create(this.order).subscribe({
      next: () => {
        this.router.navigateByUrl('/payment');
      },
      error: (errorResponse) => {
        this.toastrService.error(errorResponse.error, 'Cart');
      },
    });
  }
}
