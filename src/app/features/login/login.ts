import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/auth';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Logo } from '../../shared/logo/logo';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DangerIcon } from '../../shared/danger-icon/danger-icon';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Logo, DangerIcon],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  protected error = signal('');
  private breakpointObserver = inject(BreakpointObserver);

  protected logoWidth = toSignal(
    this.breakpointObserver
      .observe('(max-width: 768px)')
      .pipe(map((result) => (result.matches ? 60 : 80))),
    { initialValue: 80 },
  );

  protected form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    const { email, password } = this.form.getRawValue();
    return this.auth.login(email, password).subscribe({
      next: () => this.router.navigate(['/restaurants']),
      error: (err: HttpErrorResponse) => {
        if (err.error?.error?.code === 'INVALID_CREDENTIALS') {
          this.error.set('Correo o contraseña incorrectos. Revisa los datos e inténtalo de nuevo');
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
