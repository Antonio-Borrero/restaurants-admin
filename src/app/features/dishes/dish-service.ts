import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Dish } from '../../shared/menu-interface/menu-interface';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  private http = inject(HttpClient);

  getDish(dishId: string, locale: string) {
    return this.http.get<Dish>(`${environment.apiUrl}/dishes/${dishId}?locale=${locale}`);
  }
}
