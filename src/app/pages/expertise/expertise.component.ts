import { Component } from '@angular/core';

import { ButtonComponent } from '../../shared/button/button.component';
import { ArrowButtonComponent } from '../../shared/arrow-button/arrow-button.component';

@Component({
  selector: 'app-expertise',
  standalone: true,
  imports: [ButtonComponent, ArrowButtonComponent],
  templateUrl: './expertise.component.html',
  styleUrl: './expertise.component.scss',
})
export class ExpertiseComponent {}
