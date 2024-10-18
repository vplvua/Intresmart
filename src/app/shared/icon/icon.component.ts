import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconSize } from '../../models/models';
import { IconColor } from '../../models/models';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `<svg [ngClass]="[sizeClasses, colorClass]">
    <use [attr.xlink:href]="'assets/icons/sprite.svg#' + name"></use>
  </svg>`,
  styles: '',
})
export class IconComponent {
  @Input() name: string = '';
  @Input() size: IconSize = 'medium';
  @Input() color: IconColor = 'secondary';

  get sizeClasses(): string {
    const baseClasses = 'inline-block';
    switch (this.size) {
      case 'small':
        return `${baseClasses} w-4 h-4`;
      case 'medium':
        return `${baseClasses} w-6 h-6`;
      case 'large':
        return `${baseClasses} w-8 h-8`;
      case 'logo':
        return `${baseClasses} w-[139px] h-[28px]`;
      default:
        return `${baseClasses}`;
    }
  }

  get colorClass(): string {
    switch (this.color) {
      case 'primary':
        return 'text-primary-100 fill-current';
      case 'secondary':
        return 'text-gray-0 fill-current';
      case 'tertiary':
        return 'text-gray-40 fill-current';
      default:
        return 'text-gray-0 fill-current';
    }
  }
}
