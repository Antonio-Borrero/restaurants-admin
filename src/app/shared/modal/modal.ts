import { Component, effect, ElementRef, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  public isOpen = input<boolean>(false);
  public close = output();
  protected modalDialog = viewChild<ElementRef<HTMLDialogElement>>('modalDialog');

  constructor() {
    effect(() =>
      this.isOpen()
        ? this.modalDialog()?.nativeElement.showModal()
        : this.modalDialog()?.nativeElement.close(),
    );
  }

  protected clickOutside(e: Event) {
    if (e.target === this.modalDialog()?.nativeElement) this.modalDialog()?.nativeElement.close();
  }
}
