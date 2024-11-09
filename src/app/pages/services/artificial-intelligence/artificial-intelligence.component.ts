import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '../../../shared/button/button.component';
import { ArrowButtonComponent } from '../../../shared/arrow-button/arrow-button.component';
import { FromTheBlogComponent } from '../../../shared/from-the-blog/from-the-blog.component';
import { LearnMoreComponent } from '../../../shared/learn-more/learn-more.component';
import { ClientReviewsComponent } from '../development-cards/development-cards.component';

@Component({
  selector: 'app-artificial-intelligence',
  standalone: true,
  imports: [
    ButtonComponent,
    ArrowButtonComponent,
    FromTheBlogComponent,
    LearnMoreComponent,
    ClientReviewsComponent,
    RouterLink,
  ],
  templateUrl: './artificial-intelligence.component.html',
})
export class ArtificialIntelligenceComponent {}
