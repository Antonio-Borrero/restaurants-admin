import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NewRestaurant, Restaurant } from './restaurant-interface';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  private http = inject(HttpClient);

  getRestaurants() {
    return this.http.get<Restaurant[]>(`${environment.apiUrl}/restaurants`);
  }

  createRestaurant(data: NewRestaurant) {
    return this.http.post<Restaurant>(`${environment.apiUrl}/restaurants`, data);
  }

  updateRestaurant(restaurantId: number, data: Partial<NewRestaurant>) {
    return this.http.patch<Restaurant>(`${environment.apiUrl}/restaurants/${restaurantId}`, data);
  }

  deleteRestaurant(restaurantId: number) {
    return this.http.delete(`${environment.apiUrl}/restaurants/${restaurantId}`, {
      params: { confirm: true },
    });
  }
}
