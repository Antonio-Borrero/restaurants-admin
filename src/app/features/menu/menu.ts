import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MenuService } from './menu-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { breakpointMobile } from '../../shared/breakpoints/breakpoints';
import { MenuDesktop } from './menu-desktop/menu-desktop';
import { MenuMobile } from './menu-mobile/menu-mobile';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, MenuDesktop, MenuMobile],
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

  protected isMobile = toSignal(
    this.breakpointObserver
      .observe(`(max-width: ${breakpointMobile}px)`)
      .pipe(map((result) => result.matches)),
    { initialValue: true },
  );

  protected menu = toSignal(
    this.route.paramMap.pipe(
      switchMap((param) => {
        const id = param.get('id')!;
        return this.menuService.getRestaurantMenu(id, 'es');
      }),
    ),
  );
}
