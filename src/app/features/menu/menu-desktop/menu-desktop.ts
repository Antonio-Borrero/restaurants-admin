import { Component, computed, input, output, signal } from '@angular/core';
import { Category, RestaurantMenu } from '../../../shared/menu-interface/menu-interface';
import { PluralizePipe } from '../../../shared/pluralize-pipe/pluralize-pipe';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { InitialsPipe } from '../../../shared/initials-pipe/initials-pipe';

@Component({
  selector: 'app-menu-desktop',
  imports: [PluralizePipe, CurrencyPipe, InitialsPipe, UpperCasePipe],
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
  public openModal = output<void>();
}
