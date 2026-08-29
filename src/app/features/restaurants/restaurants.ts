import { Component, inject } from '@angular/core';
import { RestaurantsService } from './restaurants-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-restaurants',
  imports: [],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.scss',
})
export class Restaurants {
  private restaurantsService = inject(RestaurantsService);

  protected restaurantsList = toSignal(this.restaurantsService.getRestaurants(), {
    initialValue: [],
  });
}
