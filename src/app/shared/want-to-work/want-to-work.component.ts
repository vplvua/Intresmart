import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-want-to-work',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './want-to-work.component.html',
})
export class WantToWorkComponent {}
