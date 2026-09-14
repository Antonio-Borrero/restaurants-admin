import { Component, inject, signal } from '@angular/core';
import { RestaurantsService } from './restaurants-service';
import { InitialsPipe } from '../../shared/initials-pipe/initials-pipe';
import { UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Restaurant } from './restaurant-interface';
import { RestaurantForm } from './restaurant-form/restaurant-form';

type ViewMode = 'grid' | 'list';

@Component({
  selector: 'app-restaurants',
  imports: [InitialsPipe, UpperCasePipe, RouterLink, RestaurantForm],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.scss',
})
export class Restaurants {
  private restaurantsService = inject(RestaurantsService);
  protected viewMode = signal<ViewMode>('grid');
  protected modal = signal(false);

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
    this.restaurantsList.update((value) => [...value, restaurant]);
  }
}
