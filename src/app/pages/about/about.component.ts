import { Component } from '@angular/core';

import { ButtonComponent } from '../../shared/button/button.component';
import { ArrowButtonComponent } from '../../shared/arrow-button/arrow-button.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { CardSectionComponent } from './card-section.component.ts/card-section.component';
import { ClientReviewsComponent } from './client-reviews/client-reviews.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    ButtonComponent,
    ArrowButtonComponent,
    IconComponent,
    CardSectionComponent,
    ClientReviewsComponent,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {}
