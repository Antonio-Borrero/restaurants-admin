import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NewDish, RestaurantMenu } from '../../shared/menu-interface/menu-interface';
import { Dish } from '../dishes/dishes';

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

  createCategory(restaurantId: string, name: string, locale: string) {
    return this.http.post(`${environment.apiUrl}/restaurants/${restaurantId}/categories`, {
      translations: [{ name, locale }],
    });
  }

  createDish(categoryId: number, data: NewDish) {
    return this.http.post(`${environment.apiUrl}/categories/${categoryId}/dishes`, data);
  }

  editCategory(categoryId: number, name: string, locale: string) {
    return this.http.patch(`${environment.apiUrl}/categories/${categoryId}`, {
      translations: [{ name, locale }],
    });
  }

  editDish(dishId: number, data: Partial<NewDish>) {
    return this.http.patch(`${environment.apiUrl}/dishes/${dishId}`, data);
  }
}
