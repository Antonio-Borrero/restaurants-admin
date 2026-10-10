import { Component, inject, signal } from '@angular/core';
import { RestaurantsService } from './restaurants-service';
import { InitialsPipe } from '@shared/pipes/initials-pipe/initials-pipe';
import { UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Restaurant } from './restaurant-interface';
import { RestaurantForm } from './restaurant-form/restaurant-form';
import { DeleteModal } from '@shared/components/delete-modal/delete-modal';
import { HttpErrorResponse } from '@angular/common/http';

type ViewMode = 'grid' | 'list';
type Modal =
  | { type: 'createRestaurant' }
  | { type: 'editRestaurant'; restaurant: Restaurant }
  | { type: 'deleteRestaurant'; restaurant: Restaurant }
  | null;

@Component({
  selector: 'app-restaurants',
  imports: [InitialsPipe, UpperCasePipe, RouterLink, RestaurantForm, DeleteModal],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.scss',
})
export class Restaurants {
  private restaurantsService = inject(RestaurantsService);
  protected viewMode = signal<ViewMode>('grid');
  protected modal = signal<Modal>(null);
  protected error = signal<string | null>(null);

  protected restaurantsList = signal<Restaurant[]>([]);

  constructor() {
    this.getRestaurantsList();
  }

  private getRestaurantsList() {
    return this.restaurantsService.getRestaurants().subscribe({
      next: (resp) => {
        this.restaurantsList.set(resp);
      },
    });
  }

  protected changeViewMode(viewMode: ViewMode) {
    this.viewMode.set(viewMode);
  }

  protected updateRestaurantsList(restaurant: Restaurant) {
    this.restaurantsList.update((value) => {
      if (value.some((curr) => curr.id === restaurant.id)) {
        return value.map((curr) => (curr.id === restaurant.id ? restaurant : curr));
      }
      return [...value, restaurant];
    });
  }

  protected deleteRestaurant(restaurantId: number) {
    this.restaurantsService.deleteRestaurant(restaurantId).subscribe({
      next: () => {
        this.restaurantsList.update((value) => value.filter((curr) => curr.id !== restaurantId));
        this.modal.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(
          err.error?.error?.message ??
            'No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.',
        );
      },
    });
  }
}
