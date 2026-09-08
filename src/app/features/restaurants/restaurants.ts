import { Component, inject, signal } from '@angular/core';
import { RestaurantsService } from './restaurants-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { InitialsPipe } from '../../shared/initials-pipe/initials-pipe';
import { UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

type ViewMode = 'grid' | 'list';

@Component({
  selector: 'app-restaurants',
  imports: [InitialsPipe, UpperCasePipe, RouterLink],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.scss',
})
export class Restaurants {
  private restaurantsService = inject(RestaurantsService);
  protected viewMode = signal<ViewMode>('grid');

  protected restaurantsList = toSignal(this.restaurantsService.getRestaurants(), {
    initialValue: [],
  });

  protected changeViewMode(viewMode: ViewMode) {
    this.viewMode.set(viewMode);
  }
}
