import {
  Component,
  computed,
  effect,
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
import { Dish, NewDish } from '../../../shared/menu-interface/menu-interface';
import { environment } from '../../../../environments/environment';
import { map, Observable, of, switchMap } from 'rxjs';

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
  public editDish = input<Dish | null>(null);

  constructor() {
    effect(() => {
      const dish = this.editDish();
      if (dish) {
        this.form.patchValue({
          name: dish.name ?? '',
          price: dish.price,
          originalName: dish.originalName ?? '',
          description: dish.description ?? '',
        });
        this.allergensState.set(
          ALLERGENS.reduce(
            (acc, allergen) => {
              acc[allergen] = dish.allergens.includes(allergen);
              return acc;
            },
            {} as Record<string, boolean>,
          ),
        );
      } else {
        this.form.reset();
        this.allergensState.set(
          ALLERGENS.reduce(
            (acc, allergen) => {
              acc[allergen] = false;
              return acc;
            },
            {} as Record<string, boolean>,
          ),
        );
      }
    });
  }

  private fb = inject(FormBuilder);
  protected imageFile = viewChild<ElementRef<HTMLInputElement>>('imageInput');
  protected image = signal<File | null>(null);
  protected error = signal<string>('');
  protected currency = DEFAULT_LOCALE_CURRENCY;
  protected allergens = ALLERGENS;
  protected allergensState = signal<Record<string, boolean>>({});

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
    if (this.editDish() && !this.image()) {
      return this.editDish()?.imageUrl;
    }
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
    const image = this.image();
    const dish = this.editDish();
    const allergens = Object.entries(this.allergensState())
      .filter(([, state]) => state)
      .map(([allergen]) => allergen);

    const imageUrl$: Observable<string | undefined> = image
      ? this.cloudinaryService
          .uploadImage(image, environment.cloudinaryRestaurantPreset)
          .pipe(map((resp) => resp.secure_url))
      : of(undefined);

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

    imageUrl$
      .pipe(
        switchMap((imageUrl) => {
          const fullData = removeEmptyFields({ ...data, imageUrl });

          return dish
            ? this.menuService.editDish(dish.id, fullData as NewDish)
            : this.menuService.createDish(this.categoryId(), fullData as NewDish);
        }),
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
  }
}
