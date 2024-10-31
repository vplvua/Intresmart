import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirmation-popup',
  standalone: true,
  imports: [IconComponent, ButtonComponent],
  templateUrl: './confirmation-popup.component.html',
})
export class ConfirmationPopupComponent {
  @Input() message = 'Are you sure you want to proceed?';
  @Input() articleTitle = '';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
}
