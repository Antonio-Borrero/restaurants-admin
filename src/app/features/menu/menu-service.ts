import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RestaurantMenu } from '../../shared/menu-interface/menu-interface';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private http = inject(HttpClient);

  getRestaurantMenu(restaurantId: string, locale: string) {
    return this.http.get<RestaurantMenu>(
      `${environment.apiUrl}/restaurants/${restaurantId}/menu?locale=${locale}`,
    );
  }
}
