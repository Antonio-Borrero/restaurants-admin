import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Logo],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {}
