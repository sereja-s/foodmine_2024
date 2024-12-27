import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  // добавим свойство для поля ввода поискового запроса, со значением по умолчанию: пустая строка
  searchTerm = '';

  constructor(activatedRoute: ActivatedRoute, private router: Router) {
    //получим параметры из маршрута(если они есть) и присвоим(установим) их в поле поиска
    activatedRoute.params.subscribe((params) => {
      if (params.searchTerm) this.searchTerm = params.searchTerm;
    });
  }

  /**
   * метод передающий параметр, введённый в строке поиска в поисковый запрос
   */
  search(term: string): void {
    if (term) this.router.navigateByUrl('/search/' + term);
  }
}
