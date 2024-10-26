import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: ` <button
    [ngClass]="buttonClasses"
    [disabled]="disabled"
    [type]="submit ? 'submit' : ''"
  >
    <ng-content></ng-content>
  </button>`,
  styles: `
    :host {
      display: inline-block;
      width: 100%;
      @media (min-width: 768px) {
        height: 56px;
      }
    }
    button {
      font-family: 'Helvetica', sans-serif;
      font-size: 16px;
      line-height: 117%;
      font-weight: 400;
      border: 1px solid #EAEAEA;
      width: 100%;
      @media (min-width: 768px) {
        line-height: 135%;
      }
    }
    button:disabled {
      border: 1px solid #565656;
    }`,
})
export class ButtonComponent {
  @Input() type: 'default' | 'green' = 'default';
  @Input() disabled: boolean = false;
  @Input() submit: boolean = false;

  get buttonClasses(): string {
    const baseClasses =
      'flex justify-center items-center px-4 py-4 rounded-full transition duration-300 ease-in-out';

    if (this.type === 'green') {
      return `${baseClasses} bg-gradient-focus`;
    }

    const defaultClasses = `${baseClasses}`;

    if (this.disabled) {
      return `${defaultClasses} text-[#363636] border-[#565656] bg-gradient-custom cursor-not-allowed`;
    }

    return `${defaultClasses} bg-gradient-custom text-gray-0 
      hover:bg-gradient-hover
      focus:bg-gradient-focus`;
  }
}
