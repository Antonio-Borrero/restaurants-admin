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
import { NewRestaurant, Restaurant } from '../restaurant-interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RestaurantsService } from '../restaurants-service';
import { removeEmptyFields } from '@shared/utils/remove-empty-fields/remove-empty-fields';
import { HttpErrorResponse } from '@angular/common/http';
import { DangerIcon } from '@shared/components/danger-icon/danger-icon';
import { Modal } from '@shared/components/modal/modal';
import { environment } from '@environments/environment';
import { map, Observable, of, switchMap } from 'rxjs';
import { CloudinaryService } from '@shared/services/cloudinary/cloudinary-service';

@Component({
  selector: 'app-restaurant-form',
  imports: [ReactiveFormsModule, DangerIcon, Modal],
  templateUrl: './restaurant-form.html',
  styleUrl: './restaurant-form.scss',
})
export class RestaurantForm {
  public isOpen = input<boolean>(false);
  public close = output<void>();
  public created = output<Restaurant>();
  public editRestaurant = input<Restaurant | null>(null);

  constructor() {
    effect(() => {
      const restaurant = this.editRestaurant();
      if (restaurant) {
        this.form.patchValue({
          name: restaurant.name,
          cuisineType: restaurant.cuisineType ?? '',
          address: restaurant.address ?? '',
          telephone: restaurant.telephone ?? '',
          email: restaurant.email ?? '',
          description: restaurant.description ?? '',
        });
      } else {
        this.form.reset();
      }
    });
  }

  private fb = inject(FormBuilder);
  protected imageFile = viewChild<ElementRef<HTMLInputElement>>('imageInput');
  protected image = signal<File | null>(null);
  private cloudinaryService = inject(CloudinaryService);
  private restaurantsService = inject(RestaurantsService);
  protected error = signal<string>('');

  protected form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    cuisineType: [''],
    address: [''],
    telephone: [''],
    email: ['', [Validators.email]],
    description: [''],
  });

  protected selectImage() {
    this.image.set(this.imageFile()?.nativeElement.files?.[0] ?? null);
  }

  protected imagePreview = computed(() => {
    if (this.editRestaurant() && !this.image()) {
      return this.editRestaurant()?.imageUrl;
    }
    const file = this.image();
    return file ? URL.createObjectURL(file) : null;
  });

  protected closeModal() {
    this.form.reset();
    this.image.set(null);
    this.close.emit();
  }

  protected submitForm() {
    const image = this.image();
    const restaurant = this.editRestaurant();

    const imageUrl$: Observable<string | undefined> = image
      ? this.cloudinaryService
          .uploadImage(image, environment.cloudinaryRestaurantPreset)
          .pipe(map((resp) => resp.secure_url))
      : of(undefined);

    imageUrl$
      .pipe(
        switchMap((imageUrl) => {
          const data = removeEmptyFields({ ...this.form.getRawValue(), imageUrl });

          return restaurant
            ? this.restaurantsService.updateRestaurant(
                restaurant.id,
                data as Partial<NewRestaurant>,
              )
            : this.restaurantsService.createRestaurant(data as NewRestaurant);
        }),
      )
      .subscribe({
        next: (resp) => {
          this.closeModal();
          this.created.emit(resp);
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
