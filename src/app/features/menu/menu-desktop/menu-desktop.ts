import { Component, computed, input, signal } from '@angular/core';
import { Category, RestaurantMenu } from '../menu-interface';
import { PluralizePipe } from '../../../shared/pluralize-pipe/pluralize-pipe';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { InitialsPipe } from '../../../shared/initials-pipe/initials-pipe';
import { Logo } from '../../../shared/logo/logo';

@Component({
  selector: 'app-menu-desktop',
  imports: [PluralizePipe, CurrencyPipe, InitialsPipe, UpperCasePipe, Logo],
  templateUrl: './menu-desktop.html',
  styleUrl: './menu-desktop.scss',
})
export class MenuDesktop {
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
