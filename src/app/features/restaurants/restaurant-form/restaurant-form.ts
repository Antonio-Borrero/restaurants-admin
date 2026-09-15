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
import { NewRestaurant, Restaurant } from '../restaurant-interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CloudinaryService } from '../../../shared/cloudinary/cloudinary-service';
import { RestaurantsService } from '../restaurants-service';
import { removeEmptyFields } from '../../../shared/remove-empty-fields/remove-empty-fields';
import { HttpErrorResponse } from '@angular/common/http';
import { DangerIcon } from '../../../shared/danger-icon/danger-icon';
import { Modal } from '../../../shared/modal/modal';

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
    const file = this.image();
    return file ? URL.createObjectURL(file) : null;
  });

  protected closeModal() {
    this.form.reset();
    this.image.set(null);
    this.close.emit();
  }

  protected submitForm() {
    if (this.image()) {
      this.cloudinaryService.uploadImage(this.image()!).subscribe({
        next: (resp) => {
          this.restaurantsService
            .createRestaurant(
              removeEmptyFields({
                ...this.form.getRawValue(),
                imageUrl: resp.secure_url,
              }) as NewRestaurant,
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
        },
      });
    } else {
      this.restaurantsService
        .createRestaurant(removeEmptyFields({ ...this.form.getRawValue() }) as NewRestaurant)
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
}
