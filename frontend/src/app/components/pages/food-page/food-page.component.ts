import { Component } from '@angular/core';
import { Food } from '../../../shared/model/Food';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from '../../../services/food.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-food-page',
  templateUrl: './food-page.component.html',
  styleUrl: './food-page.component.css',
})
export class FoodPageComponent {
  // добавим свойство для отдельного товара
  food!: Food;

  constructor(
    activatedRoute: ActivatedRoute,
    foodService: FoodService,
    private cartService: CartService,
    private router: Router
  ) {
    activatedRoute.params.subscribe((params) => {
      if (params.id)
        /* this.food = foodService.getFoodById(params.id); */
        // подпишемся на товар и когда сервер загрузит данные присвоим полученное с него значение искомого товара
        foodService.getFoodById(params.id).subscribe((serverFood) => {
          this.food = serverFood;
        });
    });
  }

  /**
   * добавление товара в корзину
   */
  addToCart() {
    this.cartService.addToCart(this.food);
    this.router.navigateByUrl('/cart-page');
  }
}
