import { Component } from '@angular/core';

import { ButtonComponent } from '../../../shared/button/button.component';
import { ArrowButtonComponent } from '../../../shared/arrow-button/arrow-button.component';

@Component({
  selector: 'app-discuss-new-project',
  standalone: true,
  imports: [ButtonComponent, ArrowButtonComponent],
  templateUrl: './discuss-new-project.component.html',
})
export class DiscussNewProjectComponent {}
