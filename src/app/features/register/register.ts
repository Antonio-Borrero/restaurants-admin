import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Auth } from '../../core/auth';
import { Router, RouterLink } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Logo } from '../../shared/logo/logo';
import { DangerIcon } from '../../shared/danger-icon/danger-icon';
import { breakpointMobile } from '../../shared/breakpoints/breakpoints';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, Logo, DangerIcon, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  protected error = signal('');
  private breakpointObserver = inject(BreakpointObserver);

  protected form = this.fb.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  protected logoWidth = toSignal(
    this.breakpointObserver
      .observe(`(max-width: ${breakpointMobile}px)`)
      .pipe(map((result) => (result.matches ? 60 : 80))),
    { initialValue: 80 },
  );

  onSubmit() {
    const { email, password } = this.form.getRawValue();
    return this.auth.register(email, password).subscribe({
      next: () => {
        this.auth.login(email, password).subscribe({
          next: () => this.router.navigate(['/restaurants']),
          error: (err: HttpErrorResponse) => {
            this.error.set(
              err.error?.error?.message ??
                'No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.',
            );
          },
        });
      },
      error: (err: HttpErrorResponse) => {
        if (err.error?.error?.code === 'EMAIL_ALREADY_USED') {
          this.error.set('El correo ya está registrado. Intenta iniciar sesión.');
          return;
        }
        if (err.error?.error?.code === 'VALIDATION_ERROR') {
          this.error.set(
            'Correo o contraseña no tienen un formato válido. Revisa los datos e inténtalo de nuevo',
          );
          return;
        }
        this.error.set(
          err.error?.error?.message ??
            'No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.',
        );
      },
    });
  }
}
