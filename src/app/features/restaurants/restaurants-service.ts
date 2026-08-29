import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Restaurant } from './restaurant-interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  private http = inject(HttpClient);

  getRestaurants() {
    return this.http.get<Restaurant[]>(`${environment.apiUrl}/restaurants`);
  }
}
