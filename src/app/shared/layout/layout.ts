import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Logo } from '../logo/logo';
import { Auth } from '../../core/auth';

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

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
