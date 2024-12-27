import { Component } from '@angular/core';
import { Tag } from '../../../shared/model/Tag';
import { FoodService } from '../../../services/food.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css',
})
export class TagsComponent {
  // добавим свойсто для вывода тэгов с типом массив тэгов
  tags?: Tag[];

  constructor(foodService: FoodService) {
    // заполним свойство
    /* this.tags = foodService.getAllTags(); */
    foodService.getAllTags().subscribe((serverTags) => {
      this.tags = serverTags;
    });
  }
}
