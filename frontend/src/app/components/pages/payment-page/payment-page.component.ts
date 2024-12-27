import { Component } from '@angular/core';
import { Order } from '../../../shared/model/Order';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css',
})
export class PaymentPageComponent {
  order: Order = new Order();

  constructor(orderService: OrderService, router: Router) {
    // подпишемся на создание пользователем нового заказа
    orderService.getNewOrderForCurrentUser().subscribe({
      next: (order) => {
        this.order = order;
      },
      error: () => {
        router.navigateByUrl('/chekcout');
      },
    });
  }
}
