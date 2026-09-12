import { Component, computed, input, signal } from '@angular/core';
import { Category, RestaurantMenu } from '../../../shared/menu-interface/menu-interface';
import { PluralizePipe } from '../../../shared/pluralize-pipe/pluralize-pipe';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-mobile',
  imports: [PluralizePipe, CurrencyPipe, RouterLink],
  templateUrl: './menu-mobile.html',
  styleUrl: './menu-mobile.scss',
})
export class MenuMobile {
  public menu = input.required<RestaurantMenu>();
  public categoryCount = input.required<number>();
  public dishCount = input.required<number>();
  protected selectedCategoryId = signal<number | undefined>(undefined);
  protected selectedCategory = computed<Category | undefined>(() => {
    if (this.selectedCategoryId()) {
      return this.menu().categories.find((category) => category.id === this.selectedCategoryId());
    }
    return this.menu().categories[0];
  });
}
