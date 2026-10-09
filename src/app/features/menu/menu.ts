import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MenuService } from './menu-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { breakpointMobile } from '@shared/constants/breakpoints/breakpoints';
import { MenuDesktop } from './menu-desktop/menu-desktop';
import { MenuMobile } from './menu-mobile/menu-mobile';
import { Category, Dish, RestaurantMenu } from '@shared/interfaces/menu-interface/menu-interface';
import { DEFAULT_LOCALE } from '@core/default-locale';
import { CategoryForm } from './category-form/category-form';
import { DishForm } from './dish-form/dish-form';
import { DeleteModal } from '@shared/components/delete-modal/delete-modal';
import { HttpErrorResponse } from '@angular/common/http';

type Modal =
  | { type: 'createCategory' }
  | { type: 'editCategory'; category: Category }
  | { type: 'deleteCategory'; category: Category }
  | { type: 'createDish'; categoryId: number }
  | { type: 'editDish'; categoryId: number; dish: Dish }
  | { type: 'deleteDish'; dish: Dish }
  | null;

@Component({
  selector: 'app-menu',
  imports: [RouterLink, MenuDesktop, MenuMobile, CategoryForm, DishForm, DeleteModal],
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
  protected modal = signal<Modal>(null);
  protected error = signal<string | null>(null);

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

  protected deleteDish(dishId: number) {
    this.menuService.deleteDish(dishId).subscribe({
      next: () => {
        this.getRestaurantMenu();
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

  protected deleteCategory(categoryId: number) {
    this.menuService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.getRestaurantMenu();
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

  protected getRestaurantMenu() {
    this.menuService.getRestaurantMenu(this.restaurantId, DEFAULT_LOCALE).subscribe({
      next: (resp) => {
        this.menu.set(resp);
      },
    });
  }
}
