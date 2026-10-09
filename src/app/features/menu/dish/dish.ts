import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, Location, UpperCasePipe } from '@angular/common';
import { InitialsPipe } from '@shared/pipes/initials-pipe/initials-pipe';
import { MenuService } from '../menu-service';
import { DEFAULT_LOCALE } from '@core/default-locale';
import { DishForm } from '../dish-form/dish-form';
import { Dish as dishInterface } from '@shared/interfaces/menu-interface/menu-interface';
import { HttpErrorResponse } from '@angular/common/http';
import { DeleteModal } from '@shared/components/delete-modal/delete-modal';

@Component({
  selector: 'app-dish',
  imports: [InitialsPipe, UpperCasePipe, CurrencyPipe, DishForm, DeleteModal],
  templateUrl: './dish.html',
  styleUrl: './dish.scss',
})
export class Dish {
  private route = inject(ActivatedRoute);
  private menuService = inject(MenuService);
  protected location = inject(Location);
  protected mode = signal<'view' | 'edit' | 'delete'>('view');
  protected dish = signal<dishInterface | undefined>(undefined);
  protected error = signal<string>('');

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const dishId = params.get('id');
      if (dishId) {
        this.loadDish(Number(dishId));
      } else {
        this.error.set('Plato no encontrado');
      }
    });
  }

  private loadDish(dishId: number) {
    this.menuService.getDish(dishId, DEFAULT_LOCALE).subscribe({
      next: (dish) => {
        this.dish.set(dish);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(
          err.error?.error?.message ??
            'No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.',
        );
      },
    });
  }

  protected finishEditing() {
    this.mode.set('view');
    this.loadDish(this.dish()!.id);
  }

  protected deleteDish(dishId: number) {
    this.menuService.deleteDish(dishId).subscribe({
      next: () => {
        this.location.back();
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(
          err.error?.error?.message ??
            'No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.',
        );
      },
    });
  }
}
