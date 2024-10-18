import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: ` <button [ngClass]="buttonClasses" [disabled]="disabled">
    <ng-content></ng-content>
  </button>`,
  styles: `
    :host {
      display: inline-block;
    }
    button {
      font-family: 'Helvetica', sans-serif;
      font-size: 16px;
      line-height: 135%;
      font-weight: 400;
      border: 1px solid #EAEAEA;
    }
    button:disabled {
      border: 1px solid #565656;
    }`,
})
export class ButtonComponent {
  @Input() type: 'default' | 'green' = 'default';
  @Input() disabled: boolean = false;
  @Input() width: string = '208px';

  get buttonClasses(): string {
    const baseClasses =
      'flex justify-center items-center gap-2 px-4 py-4 rounded-full transition duration-300 ease-in-out';

    if (this.type === 'green') {
      return `${baseClasses} w-[181px] h-[56px] bg-gradient-focus`;
    }

    const defaultClasses = `${baseClasses} w-[196px] h-[56px]`;

    if (this.disabled) {
      return `${defaultClasses} text-[#363636] border-[#565656] bg-gradient-custom cursor-not-allowed`;
    }

    return `${defaultClasses} bg-gradient-custom text-gray-0 
      hover:bg-gradient-hover
      focus:bg-gradient-focus`;
  }
}
