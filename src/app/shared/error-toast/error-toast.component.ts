import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorHandlingService } from '../../services/error-handling.service';

@Component({
  standalone: true,
  selector: 'app-error-toast',
  imports: [CommonModule],
  template: `
    <div *ngIf="error$ | async as error" class="error-toast">
      {{ error }}
    </div>
  `,
})
export class ErrorToastComponent {
  error$ = inject(ErrorHandlingService).error$;
}
