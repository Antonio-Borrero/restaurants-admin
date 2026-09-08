import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InitialsPipe } from '../../shared/initials-pipe/initials-pipe';
import { UpperCasePipe } from '@angular/common';
import { MenuService } from './menu-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, InitialsPipe, UpperCasePipe],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  private route = inject(ActivatedRoute);
  private menuService = inject(MenuService);

  protected menu = toSignal(
    this.route.paramMap.pipe(
      switchMap((param) => {
        const id = param.get('id')!;
        return this.menuService.getRestaurantMenu(id, 'es');
      }),
    ),
  );
}
