import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Logo } from '../logo/logo';
import { Auth } from '../../core/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Logo],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  protected auth = inject(Auth);
  protected email = this.auth.userEmail;
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  protected logoWidth = toSignal(
    this.breakpointObserver
      .observe('(max-width: 768px)')
      .pipe(map((result) => (result.matches ? 45 : 80))),
    { initialValue: 80 },
  );

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
