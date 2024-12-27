import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  icon,
  LatLng,
  latLng,
  LatLngExpression,
  LatLngTuple,
  LeafletMouseEvent,
  map,
  Map,
  marker,
  Marker,
  tileLayer,
} from 'leaflet';
import { LocationService } from '../../../services/location.service';
import { Order } from '../../../shared/model/Order';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnChanges {
  @Input() order!: Order;

  @Input() readonly = false;

  // определим поля(свойства) для маркера(иконки, указывающей положение пользователя на карте):
  // уровень масштабирования маркера
  private readonly MARKER_ZOOM_LEVEL = 16;
  // иконка маркера
  private readonly MARKER_ICON = icon({
    iconUrl:
      'https://res.cloudinary.com/foodmine/image/upload/v1638842791/map/marker_kbua9q.png',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });

  // свойство для указания широты и долготы на карте по умолчанию
  private readonly DEFAULT_LATLNG: LatLngTuple = [13.75, 21.62];

  // укажем декоратор для доступа к ссылочной переменой #map в шаблоне
  @ViewChild('map', { static: true })
  mapRef!: ElementRef;
  // объявим переменную для карты
  map!: Map;
  // добавим поле(свойство) с названием текущего маркера (будет использоваться как точка отчёта для текущего маркера)
  currentMarker!: Marker;

  constructor(private locationService: LocationService) {}

  /* ngOnInit(): void {
    this.initializeMap();
  } */
  // когда мы получим заказ с сервера и установим его в компоненте сработает хук
  ngOnChanges(): void {
    if (!this.order) return;
    this.initializeMap();

    if (this.readonly && this.addressLatLng) {
      this.showLocationOnReadonlyMode();
    }
  }

  /**
   * Метод устанавливает для карты режим: только для чтения
   */
  showLocationOnReadonlyMode() {
    // сохраним карту в константе
    const m = this.map;
    // установим маркер согласно координатам заказа
    this.setMarker(this.addressLatLng);
    // переместим маркер на место на карте с указанным масштабом
    m.setView(this.addressLatLng, this.MARKER_ZOOM_LEVEL);

    // в режиме только для чтения отключим некоторые функции, которые позволяют вносить изменения в карте
    m.dragging.disable();
    m.touchZoom.disable();
    m.doubleClickZoom.disable();
    m.scrollWheelZoom.disable();
    m.boxZoom.disable();
    m.keyboard.disable();
    m.off('click');
    m.tapHold?.disable();
    this.currentMarker.dragging?.disable();
  }

  /**
   * Метод для инициализации карты
   */
  initializeMap() {
    if (this.map) return;

    this.map = map(this.mapRef.nativeElement, {
      attributionControl: false,
    }).setView(this.DEFAULT_LATLNG, 1);

    tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);

    // добавим перемещение маркера в место щелчка на карте
    this.map.on('click', (e: LeafletMouseEvent) => this.setMarker(e.latlng));
  }

  /**
   * Метод находит местоположение пользователя
   */
  findMyLocation() {
    this.locationService.getCurrentLocation().subscribe({
      next: (latlng) => {
        // установим вид карты на текущее местоположение
        this.map.setView(latlng, this.MARKER_ZOOM_LEVEL);
        this.setMarker(latlng);
      },
    });
  }

  /**
   * Метод установит маркер на карту
   */
  setMarker(latlng: LatLngExpression) {
    this.addressLatLng = latlng as LatLng;
    if (this.currentMarker) {
      this.currentMarker.setLatLng(latlng);
      return;
    }
    // создадим новый маркер
    this.currentMarker = marker(latlng, {
      // маркер должен быть перетаскиваемым
      draggable: true,
      // вид икнки маркера
      icon: this.MARKER_ICON,
    }).addTo(this.map);

    // добавим слушатель событий для получения текущего местоположения маркера после завершения перетаскивания
    // когда перетаскивание будет закончено вызывается функция обратного вызова
    this.currentMarker.on('dragend', () => {
      this.addressLatLng = this.currentMarker.getLatLng();
    });
  }

  /**
   * Сеттер для установки широты и долготы в заказе
   */
  set addressLatLng(latlng: LatLng) {
    if (!latlng.lat.toFixed) return;
    // преобразуем широту и долготу в вид с 8-мью знаками после запятой
    latlng.lat = parseFloat(latlng.lat.toFixed(8));
    latlng.lng = parseFloat(latlng.lng.toFixed(8));
    // сохраним в свойстве(поле) заказа полученные широту и долготу
    this.order.addressLatLng = latlng;
    console.log(this.order.addressLatLng);
  }

  /**
   * Геттер для получения широты и долготы в заказе
   */
  get addressLatLng() {
    return this.order.addressLatLng!;
  }
}
