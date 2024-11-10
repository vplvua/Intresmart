import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '../../shared/button/button.component';
import { ArrowButtonComponent } from '../../shared/arrow-button/arrow-button.component';
import { CardSectionComponent } from './card-section.component.ts/card-section.component';
import { ClientReviewsComponent } from './client-reviews/client-reviews.component';
import { VacanciesWidgetComponent } from '../../shared/vacancies/vacancies-widget.component';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    ButtonComponent,
    ArrowButtonComponent,
    CardSectionComponent,
    ClientReviewsComponent,
    RouterLink,
    VacanciesWidgetComponent,
    LoaderComponent,
  ],
  templateUrl: './about.component.html',
})
export class AboutComponent {}
