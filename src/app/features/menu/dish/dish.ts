import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe, Location, UpperCasePipe } from '@angular/common';
import { InitialsPipe } from '../../../shared/initials-pipe/initials-pipe';
import { DEFAULT_LOCALE } from '../../../core/default-locale';
import { MenuService } from '../menu-service';

@Component({
  selector: 'app-dish',
  imports: [InitialsPipe, UpperCasePipe, CurrencyPipe],
  templateUrl: './dish.html',
  styleUrl: './dish.scss',
})
export class Dish {
  private route = inject(ActivatedRoute);
  private menuService = inject(MenuService);
  protected location = inject(Location);

  protected dish = toSignal(
    this.route.paramMap.pipe(
      switchMap((param) => {
        const id = param.get('id')!;
        return this.menuService.getDish(id, DEFAULT_LOCALE).pipe(catchError(() => of(null)));
      }),
    ),
  );
}
