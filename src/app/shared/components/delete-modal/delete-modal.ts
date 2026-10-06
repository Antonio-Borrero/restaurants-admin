import { Component, input, output } from '@angular/core';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-delete-modal',
  imports: [Modal],
  templateUrl: './delete-modal.html',
  styleUrl: './delete-modal.scss',
})
export class DeleteModal {
  public isOpen = input<boolean>(false);
  public dishName = input<string>('');
  public close = output<void>();
  public delete = output<void>();
  public errorMessage = input<string | null>(null);
}
