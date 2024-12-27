import { Injectable } from '@angular/core';
import { Food } from '../shared/model/Food';
import { sample_foods, sample_tags } from '../../data';
import { Tag } from '../shared/model/Tag';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  FOODS_BY_ID_URL,
  FOODS_BY_SEARCH_URL,
  FOODS_BY_TAG_URL,
  FOODS_TAGS_URL,
  FOODS_URL,
} from '../shared/constants/urls';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  constructor(private http: HttpClient) {}

  /**
   * Получим все товары
   */
  /* getAll(): Food[] {
    return sample_foods;
  } */

  // т.к. http передаёт на сервер наблюдаемый объект, на который нужно подписаться, укажем что это нужно вернуть в методе
  getAll(): Observable<Food[]> {
    // в методе get() в < > укажем тип возвращаемых им данных
    return this.http.get<Food[]>(FOODS_URL);
  }

  /**
   * получим все товары, соответствующие поисковому запросу (поиск не зависит от регистра букв)
   */
  /* getAllFoodsBySearchTerm(searchTerm: string) {
    return this.getAll().filter((food) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } */

  getAllFoodsBySearchTerm(searchTerm: string) {
    return this.http.get<Food[]>(FOODS_BY_SEARCH_URL + searchTerm);
  }

  /**
   * получим все тэги
   */
  /* getAllTags(): Tag[] {
    return sample_tags;
  } */

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(FOODS_TAGS_URL);
  }

  /**
   * получим и вернём все товары по тэгу: All или получим все товары и затем вернём только те товары, в свойстве которых есть искомый тэг
   */
  /* getAllFoodsByTag(tag: string): Food[] {
    return tag === 'All'
      ? this.getAll()
      : this.getAll().filter((food) => food.tags?.includes(tag));
  } */

  getAllFoodsByTag(tag: string): Observable<Food[]> {
    return tag === 'All'
      ? this.getAll()
      : this.http.get<Food[]>(FOODS_BY_TAG_URL + tag);
  }

  /**
   * получим товар по идентификатору(Id)
   */
  /* getFoodById(foodId: string): Food {
    // получим все продукты и найдём тот, идентификатор которого равен входному параметру
    return this.getAll().find((food) => food.id == foodId) ?? new Food();
  } */

  getFoodById(foodId: string): Observable<Food> {
    // получим все продукты и найдём тот, идентификатор которого равен входному параметру
    return this.http.get<Food>(FOODS_BY_ID_URL + foodId);
  }
}
