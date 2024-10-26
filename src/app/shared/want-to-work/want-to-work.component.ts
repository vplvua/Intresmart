import { Component } from '@angular/core';

import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-want-to-work',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './want-to-work.component.html',
})
export class WantToWorkComponent {}
