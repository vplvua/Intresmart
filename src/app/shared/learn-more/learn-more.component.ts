import { Component } from '@angular/core';

import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-learn-more',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './learn-more.component.html',
})
export class LearnMoreComponent {}
