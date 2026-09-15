import { Component, inject, input, output, signal } from '@angular/core';
import { Modal } from '../../../shared/modal/modal';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuService } from '../menu-service';
import { DangerIcon } from '../../../shared/danger-icon/danger-icon';
import { ActivatedRoute } from '@angular/router';
import { DEFAULT_LOCALE } from '../../../core/default-locale';
import { HttpErrorResponse } from '@angular/common/http';
import { Category } from '../../../shared/menu-interface/menu-interface';

@Component({
  selector: 'app-category-form',
  imports: [Modal, ReactiveFormsModule, DangerIcon],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryForm {
  public isOpen = input<boolean>(false);
  public close = output<void>();
  public created = output<void>();

  private fb = inject(FormBuilder);
  private menuService = inject(MenuService);
  private route = inject(ActivatedRoute);
  protected error = signal<string>('');

  protected form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
  });

  protected closeModal() {
    this.form.reset();
    this.close.emit();
  }

  protected submitForm() {
    const restaurantId = this.route.snapshot.paramMap.get('id')!;
    this.menuService
      .createCategory(restaurantId, this.form.getRawValue().name, DEFAULT_LOCALE)
      .subscribe({
        next: () => {
          this.closeModal();
          this.created.emit();
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
