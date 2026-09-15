import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DishService } from './dish-service';
import { catchError, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { InitialsPipe } from '../../shared/initials-pipe/initials-pipe';
import { CurrencyPipe, Location, UpperCasePipe } from '@angular/common';
import { DEFAULT_LOCALE } from '../../core/default-locale';

@Component({
  selector: 'app-dishes',
  imports: [InitialsPipe, UpperCasePipe, CurrencyPipe],
  templateUrl: './dishes.html',
  styleUrl: './dishes.scss',
})
export class Dish {
  private route = inject(ActivatedRoute);
  private dishService = inject(DishService);
  protected location = inject(Location);

  protected dish = toSignal(
    this.route.paramMap.pipe(
      switchMap((param) => {
        const id = param.get('id')!;
        return this.dishService.getDish(id, DEFAULT_LOCALE).pipe(catchError(() => of(null)));
      }),
    ),
  );
}
