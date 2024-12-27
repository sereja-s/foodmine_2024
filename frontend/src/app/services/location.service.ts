import { Injectable } from '@angular/core';
import { LatLngLiteral } from 'leaflet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor() {}

  getCurrentLocation(): Observable<LatLngLiteral> {
    // если что то меняется наблюдатель: observer сообщит об этом наблюдаемому объекту: new Observable
    return new Observable((observer) => {
      // проверим поддерживает ли браузер локацию навигатора
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          observer.next({
            // получим координаты широты
            lat: pos.coords.latitude,
            // и долготы
            lng: pos.coords.longitude,
          });
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
}
