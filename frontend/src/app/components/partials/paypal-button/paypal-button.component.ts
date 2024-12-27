import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Order } from '../../../shared/model/Order';
import { OrderService } from '../../../services/order.service';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

//window.paypal по другому это можно записать так:
declare var paypal: any;

@Component({
  selector: 'paypal-button',
  templateUrl: './paypal-button.component.html',
  styleUrl: './paypal-button.component.css',
})
export class PaypalButtonComponent implements OnInit {
  @Input() order!: Order;

  @ViewChild('paypal', { static: true })
  paypalElement!: ElementRef;

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    const self = this;
    paypal
      .Buttons({
        // начало оформления заказа (функция вызывается при нажатии кнопки paypal-button)
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            // указываем количество покупок
            purchase_units: [
              {
                amount: {
                  currency_code: 'CAD',
                  value: self.order.totalPrice,
                },
              },
            ],
          });
        },

        onApprove: async (data: any, actions: any) => {
          // получаем данные о платеже для отправки их на сервер, вызвав функцию захвата
          const payment = await actions.order.capture();
          this.order.paymentId = payment.id;
          self.orderService.pay(this.order).subscribe({
            next: (orderId) => {
              this.cartService.clearCart();
              this.router.navigateByUrl('/track/' + orderId);
              this.toastrService.success(
                'Payment Saved Successfully',
                'Success'
              );
            },
            error: (error) => {
              this.toastrService.error('Payment Save Failed', 'Error');
            },
          });
        },

        onError: (err: any) => {
          this.toastrService.error('Payment Failed', 'Error');
          console.log(err);
        },
      })
      // функция говорит куда надо добавить кнопки paypal, т.е. их нужно привязать к html-тэгу
      .render(this.paypalElement.nativeElement);
  }
}
