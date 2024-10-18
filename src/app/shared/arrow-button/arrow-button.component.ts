import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-arrow-button',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <button [ngClass]="buttonClasses" [disabled]="disabled" (click)="onClick()">
      <app-icon name="arrow-up-right" size="large" color="secondary"></app-icon>
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
    }
    button {
      border: 1px solid #EAEAEA;
    }
    button:disabled {
      transition: all 0.3s ease;
      border: 1px solid #565656;
    }`,
})
export class ArrowButtonComponent {
  @Input() disabled: boolean = false;
  @Input() onClick: () => void = () => {};

  get buttonClasses(): string {
    const baseClasses =
      'flex justify-center items-center w-14 h-14 rounded-full border';

    if (this.disabled) {
      return `${baseClasses} border-gray-75 bg-gradient-custom cursor-not-allowed opacity-50`;
    }

    return `${baseClasses} border-gray-0 bg-gradient-custom 
      hover:bg-gradient-hover focus:bg-gradient-focus
      active:bg-gradient-focus`;
  }
}
