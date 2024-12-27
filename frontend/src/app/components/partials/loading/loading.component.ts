import { Component } from '@angular/core';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css',
})
export class LoadingComponent {
  isLoading!: boolean;
  constructor(loadingService: LoadingService) {
    // синхронизируем локальную переменную: isLoading с наблюдаемым свойством, возвращаеммым геттером из сервиса-загрзки и подпишемся
    loadingService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }
}
