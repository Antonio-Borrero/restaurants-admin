import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from '../../../shared/modal/modal';
import { DangerIcon } from '../../../shared/danger-icon/danger-icon';
import { DEFAULT_LOCALE, DEFAULT_LOCALE_CURRENCY } from '../../../core/default-locale';
import { ALLERGENS } from '../allergens';
import { MenuService } from '../menu-service';
import { HttpErrorResponse } from '@angular/common/http';
import { CloudinaryService } from '../../../shared/cloudinary/cloudinary-service';
import { removeEmptyFields } from '../../../shared/remove-empty-fields/remove-empty-fields';
import { NewDish } from '../../../shared/menu-interface/menu-interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dish-form',
  imports: [Modal, ReactiveFormsModule, DangerIcon],
  templateUrl: './dish-form.html',
  styleUrl: './dish-form.scss',
})
export class DishForm {
  public isOpen = input<boolean>(false);
  public close = output<void>();
  public created = output<void>();
  public categoryId = input.required<number>();
  private menuService = inject(MenuService);
  private cloudinaryService = inject(CloudinaryService);

  private fb = inject(FormBuilder);
  protected imageFile = viewChild<ElementRef<HTMLInputElement>>('imageInput');
  protected image = signal<File | null>(null);
  protected error = signal<string>('');
  protected currency = DEFAULT_LOCALE_CURRENCY;
  protected allergens = ALLERGENS;
  protected allergensState = signal<Record<string, boolean>>(
    ALLERGENS.reduce(
      (acc, allergen) => {
        acc[allergen] = false;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  protected form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    price: ['', [Validators.required]],
    originalName: [''],
    description: [''],
    imageUrl: [''],
  });

  protected selectImage() {
    this.image.set(this.imageFile()?.nativeElement.files?.[0] ?? null);
  }

  protected imagePreview = computed(() => {
    const file = this.image();
    return file ? URL.createObjectURL(file) : null;
  });

  protected closeModal() {
    this.form.reset();
    this.close.emit();
  }

  toggleAllergen(allergen: string) {
    this.allergensState.update((state) => {
      return { ...state, [allergen]: !state[allergen] };
    });
  }

  protected submitForm() {
    const allergens = Object.entries(this.allergensState())
      .filter(([, state]) => state)
      .map(([allergen]) => allergen);

    const data = {
      price: Number(this.form.getRawValue().price),
      allergens: allergens,
      originalName: this.form.getRawValue().originalName,
      translations: [
        {
          locale: DEFAULT_LOCALE,
          name: this.form.getRawValue().name,
          description: this.form.getRawValue().description,
        },
      ],
    };

    if (this.image()) {
      this.cloudinaryService
        .uploadImage(this.image()!, environment.cloudinaryDishPreset)
        .subscribe({
          next: (resp) => {
            this.menuService
              .createDish(
                this.categoryId(),
                removeEmptyFields({ ...data, imageUrl: resp.secure_url }) as NewDish,
              )
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
          },
        });
    } else {
      this.menuService
        .createDish(this.categoryId(), removeEmptyFields({ ...data }) as NewDish)
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
}
