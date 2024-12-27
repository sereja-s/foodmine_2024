import { Component } from '@angular/core';
import { Food } from '../../../shared/model/Food';
import { FoodService } from '../../../services/food.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  foods: Food[] = [];
  constructor(
    private foodService: FoodService,
    activatedRoute: ActivatedRoute
  ) {
    // сделаем товары наблюдаемым объектом
    let foodObservable: Observable<Food[]>;
    // следим за параметрами активированного маршрута (при изменении параметров, вызывается функция внутри subscribe())
    activatedRoute.params.subscribe((params) => {
      // проверим есть ли в параметрах маршрута соответствующий поисковый запрос
      // (в новой версии Ангуляр при обращении к параметру маршрута требуется запись видв: params['searchTerm'], чтобы обратиться через точку необходимо в tsconfig.json установить значение свойства: "noPropertyAccessFromIndexSignature": false)
      if (params.searchTerm)
        /* this.foods = this.foodService.getAllFoodsBySearchTerm(params.searchTerm); */
        foodObservable = this.foodService.getAllFoodsBySearchTerm(
          params.searchTerm
        );
      else if (params.tag)
        /*  this.foods = this.foodService.getAllFoodsByTag(params.tag); */
        foodObservable = this.foodService.getAllFoodsByTag(params.tag);
      else foodObservable = foodService.getAll();
      /* вместо this.foods = foodService.getAll(); */

      // подпишемся на наблюдаемый за товарами объект, чтобы получить необходимые товары
      foodObservable.subscribe((serverFoods) => {
        this.foods = serverFoods;
      });
    });
  }
}
