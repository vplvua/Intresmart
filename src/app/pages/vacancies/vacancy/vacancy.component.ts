import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';

import { ButtonComponent } from '../../../shared/button/button.component';
import { VacanciesService } from '../../../services/vacancies.service';
import { AuthService } from '../../../services/auth.service';
import { Vacancy } from '../../../models/models';
import { LoaderComponent } from '../../../shared/loader/loader.component';

@Component({
  selector: 'app-vacancy',
  standalone: true,
  imports: [ButtonComponent, CommonModule, RouterLink, LoaderComponent],
  templateUrl: './vacancy.component.html',
})
export class VacancyComponent {
  private route = inject(ActivatedRoute);
  private vacanciesService = inject(VacanciesService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  isLoggedIn$ = this.authService.user$;

  vacancy$ = this.vacanciesService.vacancies$.pipe(
    map((vacancies) => {
      const slug = this.route.snapshot.paramMap.get('slug');
      return vacancies.find((v) => v.slug === slug);
    }),
    takeUntil(this.destroy$)
  );

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
