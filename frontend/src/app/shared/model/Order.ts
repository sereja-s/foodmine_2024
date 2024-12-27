import { LatLng } from 'leaflet';
import { CartItem } from './CartItem';

export class Order {
  id!: number;
  // массив товаров из корзины, где order.items = cart.items
  items!: CartItem[];
  totalPrice!: number;
  name!: string;
  address!: string;
  addressLatLng?: LatLng;
  paymentId!: string;
  createdAt!: string;
  status!: string;
}
