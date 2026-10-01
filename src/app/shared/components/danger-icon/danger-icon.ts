import { Component, input } from '@angular/core';

@Component({
  selector: 'app-danger-icon',
  imports: [],
  templateUrl: './danger-icon.html',
  styleUrl: './danger-icon.scss',
})
export class DangerIcon {
  width = input.required<number>();
}
