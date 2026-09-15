import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MenuService } from './menu-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { breakpointMobile } from '../../shared/breakpoints/breakpoints';
import { MenuDesktop } from './menu-desktop/menu-desktop';
import { MenuMobile } from './menu-mobile/menu-mobile';
import { RestaurantMenu } from '../../shared/menu-interface/menu-interface';
import { DEFAULT_LOCALE } from '../../core/default-locale';
import { CategoryForm } from './category-form/category-form';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, MenuDesktop, MenuMobile, CategoryForm],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  private route = inject(ActivatedRoute);
  private menuService = inject(MenuService);
  private breakpointObserver = inject(BreakpointObserver);
  protected categoryCount = computed(() => this.menu()?.categories.length);
  protected dishCount = computed(() =>
    this.menu()?.categories.reduce((count, category) => count + category.dishes.length, 0),
  );
  protected menu = signal<RestaurantMenu | null>(null);
  private restaurantId = '';

  constructor() {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id')!;
        this.restaurantId = id;
        this.getRestaurantMenu();
      },
    });
  }

  protected isMobile = toSignal(
    this.breakpointObserver
      .observe(`(max-width: ${breakpointMobile}px)`)
      .pipe(map((result) => result.matches)),
    { initialValue: true },
  );

  protected getRestaurantMenu() {
    this.menuService.getRestaurantMenu(this.restaurantId, DEFAULT_LOCALE).subscribe({
      next: (resp) => {
        this.menu.set(resp);
      },
    });
  }
}
