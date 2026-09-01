import { Component, inject } from '@angular/core';
import { RestaurantsService } from './restaurants-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { InitialsPipe } from './initials-pipe';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-restaurants',
  imports: [InitialsPipe, UpperCasePipe],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.scss',
})
export class Restaurants {
  private restaurantsService = inject(RestaurantsService);

  protected restaurantsList = toSignal(this.restaurantsService.getRestaurants(), {
    initialValue: [],
  });
}
